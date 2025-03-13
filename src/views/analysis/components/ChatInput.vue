<template>
  <div
    class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#343541] pt-4 pb-4"
  >
    <div class="max-w-5xl mx-auto px-4">
      <div class="relative flex flex-col">
        <!-- 功能按钮区域 -->
        <div
          class="flex items-center transition-all duration-300 ease-in-out"
          :class="{
            'opacity-0 h-0 mb-0 pointer-events-none transform translate-y-2':
              currentMode,
            'opacity-100 h-auto mb-1 transform translate-y-0': !currentMode
          }"
        >
          <div class="w-full flex gap-1 overflow-x-auto">
            <button
              v-for="(item, index) in buttons"
              :key="index"
              class="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap"
              :class="[
                scene === item.scene
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-[#3370FF]'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
              ]"
              @click="handleButtonClick(item)"
            >
              <el-icon class="text-sm">
                <component :is="item.icon" />
              </el-icon>
              {{ item.text }}
            </button>
            <!-- 导出按钮 -->
            <button
              v-if="hasMessages"
              class="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#3370FF] dark:hover:border-[#3370FF] text-gray-800 dark:text-gray-200 hover:text-[#3370FF] dark:hover:text-[#3370FF] hover:bg-blue-50 dark:hover:bg-[#3370FF]/10 transition-colors whitespace-nowrap"
              @click="$emit('export-pdf')"
            >
              <el-icon class="text-sm">
                <Download />
              </el-icon>
              导出对话
            </button>
          </div>
        </div>

        <!-- 输入框和按钮区域 -->
        <div
          class="flex-1 relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:!border-[#3370ff] dark:focus-within:!border-[#3370ff] transition-all duration-300 ease-in-out mt-1"
        >
          <!-- 模式标题样式 -->
          <Transition
            enter-active-class="transition-all duration-300 ease-in-out"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-300 ease-in-out"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-2"
          >
            <div
              v-if="currentMode"
              class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-t-xl"
            >
              <el-icon class="text-sm text-[#3370FF]">
                <component :is="currentMode.icon" />
              </el-icon>
              {{ currentMode.title }}
              <button
                class="ml-1 w-5 h-5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex items-center justify-center"
                @click="$emit('close-mode')"
              >
                <el-icon
                  class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Close />
                </el-icon>
              </button>
            </div>
          </Transition>

          <div class="relative">
            <textarea
              ref="textareaRef"
              rows="1"
              class="w-full resize-none rounded-xl pl-4 pr-12 py-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none border-0 leading-[1.6] align-middle text-sm"
              :class="{
                'rounded-t-none': currentMode
              }"
              :placeholder="placeholder || '输入您的问题...'"
              v-model="inputValue"
              @input="handleInput"
              @keydown="handleKeyDown"
              :disabled="disabled"
              style="height: 56px; min-height: 56px"
            ></textarea>

            <!-- 发送按钮 -->
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#3370FF] hover:bg-[#2860FF] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              :disabled="!inputValue.trim() || isSearching || disabled"
              @click="handleSubmit"
            >
              <el-icon v-if="!isSearching" class="text-lg">
                <Position />
              </el-icon>
              <el-icon v-else class="text-lg animate-spin">
                <Loading />
              </el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Position,
  Loading,
  Close,
  Monitor,
  Edit,
  Search,
  Collection,
  Trophy,
  Download,
  ChatLineRound,
  Connection,
  Notebook,
  Document
} from "@element-plus/icons-vue";
import type { Component } from "vue";
import { useTextarea } from "@/hooks/useTextarea";
import { ref, computed } from "vue";

const { limitInputHeight } = useTextarea();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    currentMode: {
      title: string;
      icon: Component;
      placeholder: string;
    } | null;
    isSearching: boolean;
    hasMessages: boolean;
    disabled?: boolean;
    placeholder?: string;
    scene?: string;
  }>(),
  {
    modelValue: "",
    currentMode: null,
    isSearching: false,
    hasMessages: false,
    disabled: false,
    placeholder: "",
    scene: "general"
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search"): void;
  (e: "select-mode", item: { text: string; icon: Component }): void;
  (e: "close-mode"): void;
  (e: "export-pdf"): void;
  (e: "send", value: string): void;
  (e: "scene-change", scene: string): void;
}>();

const inputValue = ref("");
const textareaRef = ref<HTMLTextAreaElement>();

// 处理输入事件
const handleInput = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement;
  limitInputHeight(e);
  inputValue.value = textarea.value;
};

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};

// 处理提交
const handleSubmit = () => {
  const value = inputValue.value.trim();
  if (!value || props.disabled) return;

  emit("send", value);
  inputValue.value = ""; // 清空输入

  // 重置文本框高度
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }
};

// 修改按钮配置
const buttons = [
  { text: "通用对话", icon: ChatLineRound, scene: "general" },
  { text: "文献检索", icon: Collection, scene: "academic" },
  { text: "文章翻译", icon: Document, scene: "translate" },
  { text: "案例分析", icon: Position, scene: "case" },
  { text: "论文润色", icon: Edit, scene: "polish" },
  { text: "代码解释", icon: Monitor, scene: "code" }
];

// 修改按钮点击处理函数
const handleButtonClick = (item: {
  text: string;
  icon: Component;
  scene: string;
}) => {
  emit("scene-change", item.scene);
};

// 移除原有的 sceneConfigs（因为已经集成到按钮配置中）
const scenePrompts = {
  general: "请用简洁清晰的语言回答问题。",
  academic: `请以表格形式提供相关学术文献的信息，包含以下字段：
| 标题 | 作者 | 发表年份 | 期刊/会议 | DOI/链接 | 主要发现 |
并在表格后提供简要的文献综述分析。`,
  technical: `请从以下几个方面进行分析：
1. 技术原理
2. 关键组件
3. 应用场景
4. 优势与局限
5. 发展趋势`,
  comparison: `请以表格形式对比分析，包含以下方面：
1. 基本特征
2. 技术原理
3. 应用场景
4. 优势
5. 局限性
6. 适用条件`
};

// 场景按钮
const sceneButtons = computed(() => {
  return Object.entries(buttons).map(([key, config]) => ({
    key: key,
    label: config.text,
    icon: config.icon
  }));
});

// 处理场景切换
const handleSceneChange = (scene: string) => {
  emit("scene-change", scene);
};
</script>

<style scoped>
/* 移除之前的自定义边框样式 */
.el-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 移除 focus ring */
textarea:focus {
  outline: none;
  box-shadow: none;
}

/* 移除 focus ring 的 Tailwind 类 */
:deep(*:focus) {
  --tw-ring-offset-shadow: none;
  --tw-ring-shadow: none;
  box-shadow: none;
}

/* 确保焦点状态的边框颜色优先级 */
.focus-within\:border-\[\#3370ff\] {
  border-color: #3370ff !important;
}

/* 优化过渡效果 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 确保动画平滑 */
.transform {
  transform-origin: top;
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform, opacity;
}

textarea {
  min-height: 56px;
  max-height: 200px;
}

/* 确保输入框内容垂直居中 */
textarea {
  padding-top: 16px;
  padding-bottom: 16px;
  line-height: 1.6;
}

/* 优化输入框圆角 */
textarea {
  border-radius: 0.75rem;
}

/* 当有模式时移除顶部圆角 */
textarea.rounded-t-none {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
