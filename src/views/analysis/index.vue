<template>
  <div
    class="flex flex-col h-[90vh] bg-white p-4 dark:bg-[#343541] rounded-lg overflow-hidden"
  >
    <div class="flex-1 flex flex-col relative">
      <!-- 模型选择 -->
      <div
        class="flex justify-center items-center mb-4 relative model-select-container"
      >
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
          @click.stop="toggleModelSelect"
        >
          <el-icon class="text-gray-400"><Monitor /></el-icon>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{
            getCurrentModelLabel()
          }}</span>
          <el-icon
            class="text-gray-400"
            :class="{ 'rotate-180': showModelSelect }"
          >
            <ArrowDown />
          </el-icon>
        </div>

        <!-- 自定义下拉菜单 -->
        <div
          v-show="showModelSelect"
          class="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1"
          @click.stop
        >
          <div
            v-for="model in availableModels"
            :key="model.value"
            class="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            :class="{
              'opacity-50 cursor-not-allowed': streaming,
              'bg-blue-50 dark:bg-blue-900/20': selectedModel === model.value
            }"
            @click.stop="handleModelSelect(model.value)"
          >
            <div class="flex flex-col">
              <span
                class="text-sm font-medium text-gray-900 dark:text-gray-100"
                >{{ model.label }}</span
              >
              <span class="text-xs text-gray-500 dark:text-gray-400">{{
                model.description
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="absolute inset-0 pt-16 overflow-auto pb-48">
        <!-- 空状态 -->
        <EmptyState
          v-if="!messages.length"
          :examples="searchExamples"
          @select="handleExampleSelect"
          @refresh="refreshExamples"
        />
        <!-- 消息列表 -->
        <MessageList v-else :messages="messages" @clear="handleClear" />
      </div>

      <!-- 输入区域 -->
      <ChatInput
        v-model="inputValue"
        :disabled="streaming"
        :placeholder="currentMode?.placeholder"
        :scene="currentScene"
        @send="handleSend"
        @scene-change="handleSceneChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  markRaw,
  onMounted,
  watch,
  onUnmounted,
  computed,
  reactive
} from "vue";
import { marked } from "marked";
import {
  User,
  Monitor,
  Position,
  Search,
  Loading,
  CopyDocument,
  Edit,
  Collection,
  Trophy,
  ChatLineRound,
  Notebook,
  Connection,
  Close,
  ArrowDown,
  Document
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  ElMessage,
  ElSelect,
  ElOption,
  ElMessageBox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from "element-plus";
import Question from "@/assets/svg/question.svg";
import EmptyState from "./components/EmptyState.vue";
import MessageList from "./components/MessageList.vue";
import ChatInput from "./components/ChatInput.vue";
import { useTextarea } from "@/hooks/useTextarea";
import type { Component } from "@vue/runtime-core";
import type { Message } from "@/types/chat";
import { createChatStream } from "@/api/chat";

const router = useRouter();
const messages = ref<Message[]>([]);
const streaming = ref(false);
let currentMessage = "";

// 所有示例搜索词
const allSearchExamples = [
  "虚拟农业的概念和起源是什么？",
  "虚拟农业的主要组成部分有哪些？",
  "虚拟农业在实际生产中的应用效益？",
  "三维点云感知的基本原理是什么？",
  "三维点云的主要获取技术有哪些？",
  "三维点云处理的关键步骤是什么？",
  "三维点云重建技术的挑战和机遇？",
  "点云深度学习在农业中的应用？",
  "SLAM技术的主要分类和特点？",
  "SLAM技术使用的主要传感器？",
  "SLAM在农业场景中的应用注意事项？",
  "多视图植株三维重建的优势？",
  "深度学习在植物点云分割中的应用？",
  "果实点云深度学习网络的创新点？",
  "植物根茎补全技术的重要性？",
  "大场景地形简化技术的难点？",
  "点云语义分割在地形分析中的应用？",
  "视觉SLAM在田间路径规划中的应用？",
  "智慧果业中的果品识别技术？",
  "三维草图树木建模的优势？"
];

// 随机获取3个示例
const getRandomExamples = () => {
  const shuffled = [...allSearchExamples].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// 当前显示的示例
const searchExamples = ref<string[]>(getRandomExamples());

// 添加指令列表数据
const commands = [
  { key: "search", desc: "搜索资源", example: "搜索 Vue.js 相关资源" },
  { key: "help", desc: "查看帮助", example: "显示所有可用命令" },
  { key: "clear", desc: "清空历史", example: "清空所有聊天记录" },
  { key: "example", desc: "查看示例", example: "显示使用示例" }
];

// 控制指令列表显示
const showCommands = ref(false);
const selectedCommandIndex = ref(0);

// 自动调整文本框高度
const autoGrow = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement;
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
};

// 修改 marked 配置
const renderer = new marked.Renderer();
marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer
});

// 限制输入框高度
const limitInputHeight = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement;
  const maxHeight = 100; // 最大高度
  textarea.style.height = "auto";

  const newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${newHeight}px`;

  // 如果内容超出最大高度，允许滚动
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

// 添加会话存储相关的常量
const CHAT_STORAGE_KEY = "chat_messages";
const CHAT_EXPIRY_KEY = "chat_expiry";
const CHAT_EXPIRY_TIME = 10 * 60 * 1000; // 10分钟的毫秒数

// 保存会话到本地存储
const saveChat = () => {
  const now = Date.now();
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.value));
  localStorage.setItem(CHAT_EXPIRY_KEY, String(now + CHAT_EXPIRY_TIME));
};

// 加载会话
const loadChat = () => {
  try {
    const expiry = Number(localStorage.getItem(CHAT_EXPIRY_KEY));
    const now = Date.now();

    // 检查是否过期
    if (expiry && now < expiry) {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        messages.value = JSON.parse(savedMessages);
      }
    } else {
      // 清除过期数据
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_EXPIRY_KEY);
    }
  } catch (error) {
    console.error("Error loading chat:", error);
  }
};

// 监听消息变化
watch(
  messages,
  () => {
    saveChat();
  },
  { deep: true }
);

// 组件挂载时初始化示例
onMounted(() => {
  const savedModel = localStorage.getItem("selected_model");
  if (savedModel && availableModels.some(model => model.value === savedModel)) {
    selectedModel.value = savedModel;
  }
  loadChat();
  searchExamples.value = getRandomExamples();

  // 加载保存的场景
  const savedScene = localStorage.getItem("current_scene") as SceneType;
  if (savedScene && sceneConfigs[savedScene]) {
    currentScene.value = savedScene;
  }

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".model-select-container")) {
      showModelSelect.value = false;
    }
  });
});

// 页面刷新时更新示例
const refreshExamples = () => {
  searchExamples.value = getRandomExamples();
};

// 监听路由变化，刷新示例
watch(
  () => router.currentRoute.value,
  () => {
    refreshExamples();
  }
);

// 在组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener("click", () => {
    showModelSelect.value = false;
  });
});

// 添加可用模型配置
const availableModels = [
  {
    label: "DeepSeek V3",
    value: "deepseek-ai/DeepSeek-V3",
    description: "DeepSeek 最新版大语言模型"
  },
  {
    label: "Qwen 2.5",
    value: "Qwen/Qwen2.5-72B-Instruct",
    description: "通义千问2.5代72B大语言模型"
  },
  {
    label: "Meta Llama",
    value: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    description: "Meta最新版Llama 3.1大语言模型"
  }
] as const;

// 选中的模型
const selectedModel = ref<string>(availableModels[0].value);

// 获取当前选中模型的标签
const getCurrentModelLabel = () => {
  const currentModel = availableModels.find(
    model => model.value === selectedModel.value
  );
  return currentModel?.label || "选择模型";
};

// 添加下拉菜单显示状态
const showModelSelect = ref(false);

// 修改模型选择处理函数
const handleModelSelect = (value: string) => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }

  showModelSelect.value = false;

  // 保存选择到本地存储
  localStorage.setItem("selected_model", value);

  // 如果有未完成的对话，提示用户
  if (messages.value.length > 0) {
    ElMessageBox.confirm("切换模型将清空当前会话，是否继续？", "切换模型", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        selectedModel.value = value;
        messages.value = [];
        streaming.value = false;
        currentMessage = "";
        // 清除本地存储
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.removeItem(CHAT_EXPIRY_KEY);
      })
      .catch(() => {
        // 取消时不改变选择
      });
  } else {
    selectedModel.value = value;
  }
};

// 添加输入框的值
const inputValue = ref("");

// 定义场景类型
type SceneType =
  | "general"
  | "academic"
  | "translate"
  | "case"
  | "polish"
  | "data"
  | "code";

// 使用 markRaw 包装图标组件
const sceneConfigs = {
  general: {
    label: "通用对话",
    icon: markRaw(ChatLineRound),
    prompt: "请用简洁清晰的语言回答问题。"
  },
  academic: {
    label: "文献检索",
    icon: markRaw(Collection),
    prompt: `请以表格形式提供农业信息技术相关文献的信息，包含以下字段：
| 标题 | 作者 | 发表年份 | 期刊/会议 | DOI/链接 | 主要发现 |
并在表格后提供简要的文献综述分析。`
  },
  translate: {
    label: "文章翻译",
    icon: markRaw(Document),
    prompt: `请判断输入文本的语言，并进行翻译：
- 如果是中文，请翻译成英文，保持学术专业性
- 如果是英文，请翻译成中文，确保表达准确
- 保持原文的专业术语准确性
- 确保翻译后的文本流畅自然
- 对于特定的专业术语，请在括号中保留原文
- 只给出翻译的结果，不需要输出额外内容`
  },
  case: {
    label: "案例分析",
    icon: markRaw(Position),
    prompt: `请分析这个农业信息技术应用案例：
1. 应用背景
2. 技术方案
3. 实施过程
4. 应用效果
5. 创新点
6. 推广价值
7. 经验总结`
  },
  polish: {
    label: "论文润色",
    icon: markRaw(Edit),
    prompt: `请帮我润色这段农业信息技术相关的学术文章内容，注意以下几点：
1. 改善学术表达，使用更专业的词汇
2. 优化句子结构，提高可读性
3. 确保术语使用准确规范
4. 增强段落间的逻辑连贯性
5. 保持学术写作风格
6. 改进文章的整体流畅度
7. 突出研究的创新点和贡献

请保持原文的核心含义不变，同时提供修改建议和理由。`
  },
  code: {
    label: "代码解释",
    icon: markRaw(Monitor),
    prompt: `请按以下步骤分析代码：
1. 首先给出带详细注释的代码版本，解释每个关键部分
2. 然后提供整体分析，包括：
   - 代码的主要功能
   - 核心算法/实现逻辑
   - 关键数据结构
   - 重要函数说明
   - 可能的优化建议
   - 潜在的问题
3. 如果是算法代码，还需说明：
   - 时间复杂度
   - 空间复杂度
   - 算法思路`
  },
  data: {
    label: "数据处理",
    icon: markRaw(Notebook),
    prompt: `请分析这个农业数据处理方法：
1. 数据类型
2. 处理流程
3. 算法选择
4. 质量控制
5. 分析方法
6. 可视化
7. 应用价值`
  }
} as const;

// 当前场景
const currentScene = ref<SceneType>("general");
const sceneState = reactive({
  current: currentScene,
  lastUpdated: Date.now()
});

// 切换场景
const handleSceneChange = (scene: SceneType) => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }

  // 更新场景状态
  currentScene.value = scene;
  sceneState.current = currentScene;
  sceneState.lastUpdated = Date.now();

  // 保存到本地存储
  localStorage.setItem("current_scene", scene);

  console.log("Scene changed to:", scene);
  console.log("Current scene config:", sceneConfigs[scene]);

  ElMessage.success(`已切换到${sceneConfigs[scene].label}模式`);
};

// 监听场景变化
watch(
  () => currentScene.value,
  newScene => {
    console.log("Scene watch triggered:", newScene);
  },
  { immediate: true }
);

// 修改发送消息的处理函数
const handleSend = async (value: string) => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }

  if (!value.trim()) {
    return;
  }

  streaming.value = true;
  currentMessage = "";
  inputValue.value = "";

  const currentSceneConfig = sceneConfigs[currentScene.value];
  if (!currentSceneConfig) {
    console.error("Invalid scene:", currentScene.value);
    ElMessage.error("场景配置错误");
    return;
  }

  // 构建发送到后端的增强查询
  const scenePrompt = currentSceneConfig.prompt;
  const enhancedQuery = `${scenePrompt}\n\n问题：${value}`;

  // 添加新消息到列表，但只显示原始问题
  messages.value.push({
    query: value, // 这里只使用原始问题
    results: [
      {
        summary: ""
      }
    ],
    streaming: true
  });

  const params = {
    history: messages.value,
    model: selectedModel.value,
    query: enhancedQuery, // 发送到后端的是增强后的查询
    scene: currentScene.value
  };

  // 保存当前状态
  saveChat();

  try {
    const cancelStream = createChatStream(
      params,
      text => {
        currentMessage += text;
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage) {
          messages.value = [
            ...messages.value.slice(0, -1),
            {
              ...lastMessage,
              results: [
                {
                  summary: currentMessage
                }
              ]
            }
          ];
          // 每次更新都保存状态
          saveChat();
        }
      },
      () => {
        streaming.value = false;
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage) {
          lastMessage.streaming = false;
          messages.value = [...messages.value];
          // 保存最终状态
          saveChat();
        }
        currentMessage = "";
      }
    );

    return cancelStream;
  } catch (error) {
    console.error("Chat error:", error);
    ElMessage.error("对话请求失败，请稍后重试");

    streaming.value = false;
    const lastMessage = messages.value[messages.value.length - 1];
    if (lastMessage) {
      lastMessage.streaming = false;
      if (!lastMessage.results[0].summary) {
        messages.value = messages.value.slice(0, -1);
        // 保存状态
        saveChat();
      }
    }
  } finally {
    // 确保在完成时重置状态
    if (!streaming.value) {
      currentMessage = "";
    }
  }
};

// 高亮关键词
const highlightKeywords = (text: string) => {
  const query = messages.value[messages.value.length - 1]?.query;
  if (!query) return text;
  const regex = new RegExp(query, "gi");
  return text.replace(
    regex,
    match => `<span class="highlight">${match}</span>`
  );
};

// 跳转到资源详情
const navigateToResource = (result: any) => {
  router.push(`/resource/${result.id}`);
};

// 添加复制功能
const copyContent = async (text: string) => {
  try {
    // 移除 Markdown 语法，只复制纯文本
    const plainText = text
      .replace(/#+\s/g, "") // 移除标题标记
      .replace(/\*\*/g, "") // 移除粗体标记
      .replace(/\*/g, "") // 移除斜体标记
      .replace(/~~[^~]*~~/g, "") // 移除删除线
      .replace(/`[^`]*`/g, "") // 移除行内代码
      .replace(/```[\s\S]*?```/g, "") // 移除代码块
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 保留链接文本
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "") // 移除图片
      .replace(/>/g, "") // 移除引用标记
      .trim();

    await navigator.clipboard.writeText(plainText);
    ElMessage.success("复制成功");
  } catch (err) {
    ElMessage.error("复制失败");
  }
};

// 处理输入事件
const handleInput = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement;
  limitInputHeight(e);

  // 检查是否输入了 /
  if (textarea.value === "/") {
    showCommands.value = true;
    selectedCommandIndex.value = 0;
  } else {
    showCommands.value = false;
  }
};

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (!showCommands.value) return;

  switch (e.key) {
    case "ArrowUp":
      e.preventDefault();
      selectedCommandIndex.value = Math.max(0, selectedCommandIndex.value - 1);
      break;
    case "ArrowDown":
      e.preventDefault();
      selectedCommandIndex.value = Math.min(
        commands.length - 1,
        selectedCommandIndex.value + 1
      );
      break;
    case "Enter":
      e.preventDefault();
      selectCommand(commands[selectedCommandIndex.value]);
      break;
    case "Escape":
      showCommands.value = false;
      break;
  }
};

// 选择指令
const selectCommand = (command: (typeof commands)[0]) => {
  messages.value = [];
  showCommands.value = false;
  // 处理不同指令的逻辑
  switch (command.key) {
    case "clear":
      messages.value = [];
      break;
    case "help":
      // 添加帮助信息到聊天
      break;
    // ... 其他指令处理
  }
};

// 添加激活模式状态
const activeMode = ref(false);

// 修改处理按钮点击
const handleButtonClick = (item: { text: string; icon: Component }) => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }

  activeMode.value = true;
  const mode = {
    title: item.text,
    icon: item.icon,
    placeholder: `请输入您的${item.text.replace("AI ", "")}问题...`
  };
  messages.value = [];
  currentMode.value = mode;

  // 清除本地存储
  localStorage.removeItem(CHAT_STORAGE_KEY);
  localStorage.removeItem(CHAT_EXPIRY_KEY);
};

// 添加当前模式状态
const currentMode = ref<{
  title: string;
  icon: Component;
  placeholder: string;
} | null>(null);

// 使用 markRaw 包装图标组件
const icons = {
  User: markRaw(User),
  Monitor: markRaw(Monitor),
  Position: markRaw(Position),
  Search: markRaw(Search),
  Loading: markRaw(Loading),
  CopyDocument: markRaw(CopyDocument),
  Edit: markRaw(Edit),
  Collection: markRaw(Collection),
  Trophy: markRaw(Trophy),
  ChatLineRound: markRaw(ChatLineRound),
  Notebook: markRaw(Notebook),
  Connection: markRaw(Connection),
  Close: markRaw(Close)
};

// 修改关闭模式方法
const closeMode = () => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }

  currentMode.value = null;
  activeMode.value = false;
  messages.value = [];

  // 清除本地存储
  localStorage.removeItem(CHAT_STORAGE_KEY);
  localStorage.removeItem(CHAT_EXPIRY_KEY);
};

// 示例选择处理
const handleExampleSelect = (example: string) => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }
  messages.value = [];
  console.log("Example selected in scene:", currentScene.value); // 添加调试日志
  const scenePrompt = sceneConfigs[currentScene.value].prompt;
  const enhancedQuery = `${scenePrompt}\n\n问题：${example}`;
  handleSend(enhancedQuery);
};

// 添加清空会话处理函数
const handleClear = () => {
  messages.value = [];
  streaming.value = false;
  currentMessage = "";
  // 清除本地存储
  localStorage.removeItem(CHAT_STORAGE_KEY);
  localStorage.removeItem(CHAT_EXPIRY_KEY);
};

// 添加导出处理函数
const handleExport = () => {
  // 这里可以添加导出功能的实现
};

// 切换下拉菜单显示状态
const toggleModelSelect = () => {
  if (streaming.value) {
    ElMessage.warning("请等待当前回答完成");
    return;
  }
  showModelSelect.value = !showModelSelect.value;
};

// 添加场景选择按钮
const sceneButtons = computed(() => {
  return Object.entries(sceneConfigs).map(([key, config]) => ({
    key: key as SceneType, // 确保类型正确
    label: config.label,
    icon: config.icon
  }));
});
</script>

<style scoped>
/* 移除之前的自定义滚动相关样式 */
.overflow-y-auto,
.overflow-x-auto {
  scrollbar-width: initial;
  -ms-overflow-style: initial;
}

.overflow-y-auto::-webkit-scrollbar,
.overflow-x-auto::-webkit-scrollbar {
  display: initial;
}

/* 移除渐变遮罩相关样式 */
.overflow-y-auto {
  mask-image: none;
  -webkit-mask-image: none;
}

/* 移除多余的滚动相关样式 */
.prose {
  overflow-wrap: break-word;
  word-break: break-word;
}

/* 移除其他自定义滚动条样式 */
::-webkit-scrollbar,
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  all: initial;
}

/* 保持代码块的样式 */
.prose :deep(pre) {
  @apply p-4 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-x-auto my-4;
  border: 1px solid #e5e7eb;
}

.dark .prose :deep(pre) {
  border-color: #374151;
}

.prose :deep(pre code) {
  @apply bg-transparent p-0 text-sm;
  white-space: pre;
}

/* 移除输入框的滚动条样式 */
textarea {
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.2s ease;
  overflow: hidden;
}

/* 输入框容器焦点效果 */
.flex-1.relative:focus-within {
  border-color: #3370ff;
}

/* 移除自动填充的背景色 */
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  -webkit-text-fill-color: inherit;
  transition: background-color 5000s ease-in-out 0s;
}

.dark textarea:-webkit-autofill,
.dark textarea:-webkit-autofill:hover,
.dark textarea:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #40414f inset;
}

/* 移除 Firefox 上的默认外边框 */
textarea:focus-visible {
  outline: none;
}

/* 气泡对话框样式 */
.message-bubble {
  position: relative;
  word-break: break-word;
  white-space: pre-wrap;
}

.message-bubble::after {
  content: "";
  position: absolute;
  right: -6px;
  bottom: 0;
  width: 12px;
  height: 12px;
  background-color: #3370ff;
  clip-path: polygon(0 0, 0% 100%, 100% 100%);
}

.message-content > div {
  position: relative;
}

.message-content > div::after {
  content: "";
  position: absolute;
  left: -6px;
  top: 0;
  width: 12px;
  height: 12px;
  background-color: #f9fafb;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.dark .message-content > div::after {
  background-color: #111827;
}

/* 结果卡片样式优化 */
.result-card {
  border: 1px solid transparent;
}

.result-card:hover {
  border-color: rgba(99, 102, 241, 0.1);
}

/* 修改 Markdown 样式 */
.prose {
  @apply text-sm leading-normal text-gray-700 dark:text-gray-300;
  max-width: 100%;
}

/* 标题样式 */
.prose :deep(h1) {
  @apply text-base font-medium mb-3 mt-4 first:mt-0 text-gray-900 dark:text-gray-100;
}

.prose :deep(h2) {
  @apply text-sm font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100;
}

.prose :deep(h3) {
  @apply text-sm font-medium mb-2 mt-3 text-gray-900 dark:text-gray-100;
}

/* 段落样式 */
.prose :deep(p) {
  @apply my-1.5 text-sm leading-relaxed;
}

/* 列表样式 */
.prose :deep(ul),
.prose :deep(ol) {
  @apply my-2 pl-4;
}

.prose :deep(ul) {
  list-style-type: disc;
}

.prose :deep(ol) {
  list-style-type: decimal;
}

.prose :deep(li) {
  @apply mb-1 ml-1;
}

.prose :deep(li > ul),
.prose :deep(li > ol) {
  @apply my-0;
}

/* 代码块样式 */
.prose :deep(pre) {
  @apply p-3 rounded-lg bg-gray-50 dark:bg-gray-800 my-3;
  border: 1px solid #e5e7eb;
}

.prose :deep(pre code) {
  @apply block text-sm font-mono text-gray-800 dark:text-gray-200;
  white-space: pre;
}

/* 行内代码样式 */
.prose :deep(:not(pre) > code) {
  @apply px-1.5 py-0.5 rounded text-sm font-mono bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200;
  border: 1px solid #e5e7eb;
}

/* 引用块样式 */
.prose :deep(blockquote) {
  @apply pl-3 border-l-2 border-gray-200 dark:border-gray-700 my-3 text-gray-600 dark:text-gray-400 italic;
}

/* 表格样式 */
.prose :deep(table) {
  @apply w-full my-3 text-sm;
  border-collapse: collapse;
}

.prose :deep(th),
.prose :deep(td) {
  @apply border border-gray-200 dark:border-gray-700 px-3 py-1;
}

.prose :deep(th) {
  @apply bg-gray-50 dark:bg-gray-800 font-medium;
}

/* 水平线样式 */
.prose :deep(hr) {
  @apply my-4;
  border: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    theme("colors.gray.200") 20%,
    theme("colors.gray.200") 80%,
    transparent
  );
}

.dark .prose :deep(hr) {
  background: linear-gradient(
    to right,
    transparent,
    theme("colors.gray.700") 20%,
    theme("colors.gray.700") 80%,
    transparent
  );
}

/* 移除多余的空白 */
.prose :deep(*:first-child) {
  margin-top: 0;
}

.prose :deep(*:last-child) {
  margin-bottom: 0;
}

/* 移除多余的样式 */
.message-content {
  width: 100%;
  overflow-wrap: break-word;
}

/* 优化代码块样式 */
.prose :deep(pre) {
  @apply p-4 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-x-auto my-4;
  border: 1px solid #e5e7eb;
  white-space: pre;
  max-width: 100%;
}

.prose :deep(pre code) {
  white-space: pre;
  overflow-x: auto;
  display: block;
}

/* 确保输入框区域始终可见 */
.fixed.bottom-4 {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.dark .fixed.bottom-4 {
  background: rgba(52, 53, 65, 0.9);
}

/* 修复选择器样式 */
:deep(.model-select) {
  .el-input {
    @apply cursor-pointer;
  }

  .el-input__wrapper {
    @apply bg-transparent border-0 shadow-none box-border px-1;
    padding-left: 0 !important;
  }

  .el-input__inner {
    @apply text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer;
    height: 24px !important;
    line-height: 24px !important;
    width: auto !important;
  }

  .el-select__caret {
    @apply text-gray-400;
  }
}

/* 修复下拉菜单样式 */
:deep(.model-select-dropdown) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg;
  padding: 4px !important;
  border-radius: 8px !important;

  .el-select-dropdown__item {
    @apply rounded-lg cursor-pointer;
    padding: 8px 12px !important;
    height: auto !important;
    line-height: 1.5 !important;

    &:hover {
      @apply bg-gray-50 dark:bg-gray-700;
    }

    &.selected {
      @apply bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400;
    }
  }
}

/* 确保下拉菜单可点击 */
:deep(.el-popper) {
  @apply z-50;
}

/* 移除其他可能影响点击的样式 */
.model-select {
  :deep(.el-input__wrapper),
  :deep(.el-input__inner),
  :deep(.el-select__caret) {
    pointer-events: auto !important;
  }
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-1;
}

:deep(.el-dropdown-menu__item) {
  @apply rounded-lg text-gray-700 dark:text-gray-300;
  padding: 8px 12px !important;

  &:hover {
    @apply bg-gray-50 dark:bg-gray-700;
  }

  &.is-disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

/* 确保下拉菜单在最上层 */
:deep(.el-popper) {
  z-index: 2000 !important;
}

/* 添加过渡动画 */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* 确保下拉菜单在其他内容之上 */
.model-select-container {
  position: relative;
  z-index: 100;
}
</style>
