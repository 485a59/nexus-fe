<template>
  <div class="flex flex-col gap-6">
    <!-- 导出和清空按钮 -->
    <div class="flex justify-between items-center px-4">
      <button
        v-if="messages.length > 0"
        class="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-300 dark:hover:border-red-500 transition-colors"
        @click="handleClear"
      >
        <el-icon class="text-base">
          <Delete />
        </el-icon>
        清空会话
      </button>

      <button
        v-if="messages.length > 0"
        class="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="exportToImage"
      >
        <el-icon class="text-base">
          <Download />
        </el-icon>
        导出会话
      </button>
    </div>

    <template v-for="(item, index) in messages" :key="index">
      <!-- 用户消息 -->
      <div class="flex justify-end">
        <div class="max-w-[75%] flex gap-3 items-end">
          <MessageBubble type="user">
            <span class="text-sm">{{ item.query }}</span>
          </MessageBubble>
        </div>
      </div>

      <!-- AI 响应 -->
      <div class="flex justify-start">
        <div class="w-full max-w-3xl flex gap-3">
          <div class="min-w-0 flex-1 message-content">
            <MessageBubble type="ai">
              <div class="relative group">
                <button
                  class="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center z-10"
                  @click="handleCopy(item.results[0]?.summary)"
                  title="复制内容"
                >
                  <el-icon class="text-gray-500 dark:text-gray-400">
                    <CopyDocument />
                  </el-icon>
                </button>
                <div
                  class="markdown-body break-words"
                  :class="{ streaming: item.streaming }"
                  v-html="formatMessage(item.results[0]?.summary)"
                ></div>
              </div>
            </MessageBubble>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- 修改导出容器样式 -->
  <div id="pdf-content" class="pdf-export-container">
    <div class="pdf-container">
      <!-- 品牌头部 -->
      <div class="brand-header">
        <img src="/logo.svg" alt="Logo" class="brand-logo" />
        <div class="brand-info">
          <h1 class="brand-name">沃知 AI</h1>
          <p class="brand-slogan">智能助手，知你所需</p>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 对话内容 -->
      <div class="chat-content">
        <template v-for="(item, index) in messages" :key="index">
          <!-- 聊天消息组 -->
          <div class="chat-group">
            <!-- 问题标签 -->
            <div class="question-label">问题 {{ index + 1 }}</div>

            <!-- 用户消息 -->
            <div class="chat-bubble user-bubble">
              <div class="bubble-content">{{ item.query }}</div>
            </div>

            <!-- AI 响应 -->
            <div class="chat-bubble ai-bubble">
              <div class="bubble-header">
                <img src="/logo.svg" alt="AI" class="ai-avatar" />
                <span class="ai-name">AI 助手</span>
              </div>
              <div
                class="bubble-content markdown-content"
                v-html="formatMessage(item.results[0]?.summary)"
              ></div>
            </div>
          </div>
        </template>
      </div>

      <!-- 页脚 -->
      <div class="chat-footer">
        <p class="export-time">{{ new Date().toLocaleString() }}</p>
        <p class="copyright">
          © {{ new Date().getFullYear() }} 沃知 AI. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CopyDocument,
  Document,
  Picture,
  Download,
  Delete
} from "@element-plus/icons-vue";
import {
  ElMessage,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from "element-plus";
import MessageBubble from "./MessageBubble.vue";
import { marked } from "marked";
import { ref } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ExportHelper } from "@/utils/export";
import type { Message } from "@/types/chat";
import { ElMessageBox } from "element-plus";

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
});

const props = defineProps<{
  messages: Message[];
}>();

const emit = defineEmits<{
  (e: "clear"): void;
}>();

// 格式化消息内容方法
const formatMessage = (content: any): string => {
  try {
    if (!content) return "";

    // 处理对象类型
    if (typeof content === "object") {
      content = JSON.stringify(content, null, 2);
    }

    const stringContent = String(content);

    // 使用 marked.parse 同步渲染 markdown
    const result = marked.parse(stringContent, {
      async: false,
      silent: true
    });

    return typeof result === "string" ? result : String(result);
  } catch (error) {
    console.error("Markdown parsing error:", error);
    return String(content);
  }
};

// 复制功能
const handleCopy = async (text: any) => {
  try {
    const plainText =
      typeof text === "object" ? JSON.stringify(text, null, 2) : String(text);
    await navigator.clipboard.writeText(plainText);
    ElMessage.success("复制成功");
  } catch (err) {
    ElMessage.error("复制失败");
  }
};

// 导出功能
const exportToImage = async () => {
  try {
    ElMessage.info("正在生成图片，请稍候...");
    const element = document.getElementById("pdf-content");
    if (!element) return;

    // 显示元素以便捕获
    element.style.display = "block";
    element.style.width = "1240px";
    element.style.position = "fixed";
    element.style.top = "-9999px";
    element.style.left = "0";
    element.style.padding = "40px";
    element.style.backgroundColor = "white";

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: 1240
    });

    // 创建下载链接
    const link = document.createElement("a");
    link.download = `AI对话记录_${new Date().toLocaleDateString()}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();

    ElMessage.success("导出成功！");
  } catch (error) {
    console.error("Export error:", error);
    ElMessage.error("导出失败");
  } finally {
    // 清理样式
    const element = document.getElementById("pdf-content");
    if (element) {
      element.style.display = "none";
      element.style.position = "";
      element.style.top = "";
      element.style.left = "";
      element.style.width = "";
      element.style.padding = "";
    }
  }
};

// 添加清空处理函数
const handleClear = () => {
  ElMessageBox.confirm("确定要清空当前会话吗？此操作不可恢复。", "清空会话", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      emit("clear");
      ElMessage.success("会话已清空");
    })
    .catch(() => {
      // 用户取消操作
    });
};
</script>

<style scoped>
.markdown-body {
  @apply text-sm leading-relaxed;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  @apply font-medium text-gray-900 dark:text-gray-100 my-3;
}

.markdown-body :deep(h1) {
  @apply text-lg;
}
.markdown-body :deep(h2) {
  @apply text-base;
}
.markdown-body :deep(h3) {
  @apply text-sm;
}

.markdown-body :deep(p) {
  @apply text-gray-700 dark:text-gray-300 my-2;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  @apply pl-5 my-3 space-y-1;
}

.markdown-body :deep(ul) {
  @apply list-disc;
}
.markdown-body :deep(ol) {
  @apply list-decimal;
}

.markdown-body :deep(li) {
  @apply text-gray-700 dark:text-gray-300;
}

.markdown-body :deep(blockquote) {
  @apply border-l-4 border-gray-200 dark:border-gray-700 pl-4 my-3 italic text-gray-600 dark:text-gray-400;
}

.markdown-body :deep(pre) {
  @apply bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto;
}

.markdown-body :deep(code) {
  @apply font-mono text-sm text-gray-800 dark:text-gray-200;
}

.markdown-body :deep(:not(pre) > code) {
  @apply bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5;
}

.markdown-body :deep(table) {
  @apply w-full my-3 border-collapse table-auto;
  border-spacing: 0;
}

.markdown-body :deep(thead) {
  @apply bg-gray-50 dark:bg-gray-800;
}

.markdown-body :deep(th) {
  @apply bg-gray-50 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100 px-4 py-2 text-left border border-gray-200 dark:border-gray-700;
}

.markdown-body :deep(td) {
  @apply text-gray-700 dark:text-gray-300 px-4 py-2 border border-gray-200 dark:border-gray-700;
}

/* 优化表格样式 */
.markdown-body :deep(table) {
  @apply w-full my-3 border-collapse table-auto;
  border-spacing: 0;
}

.markdown-body :deep(thead) {
  @apply bg-gray-50 dark:bg-gray-800;
}

.markdown-body :deep(th) {
  @apply bg-gray-50 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100 px-4 py-2 text-left border border-gray-200 dark:border-gray-700;
}

.markdown-body :deep(td) {
  @apply text-gray-700 dark:text-gray-300 px-4 py-2 border border-gray-200 dark:border-gray-700;
}

/* 移除打字机相关样式中可能影响布局的部分 */
.typewriter :deep(*) {
  white-space: pre-wrap;
}

.typewriter :deep(table) {
  display: table;
}

.typewriter :deep(thead) {
  display: table-header-group;
}

.typewriter :deep(tbody) {
  display: table-row-group;
}

.typewriter :deep(tr) {
  display: table-row;
}

.typewriter :deep(th),
.typewriter :deep(td) {
  display: table-cell;
}

/* 确保列表正确显示 */
.typewriter :deep(ul),
.typewriter :deep(ol) {
  display: block;
  list-style-position: inside;
}

.typewriter :deep(li) {
  display: list-item;
  margin: 0.25rem 0;
}

/* 优化代码块显示 */
.typewriter :deep(pre),
.typewriter :deep(code) {
  white-space: pre;
  tab-size: 2;
}

/* 调整光标位置 */
.typewriter::after {
  content: "|";
  animation: cursor 1s infinite;
  font-weight: bold;
  color: #3370ff;
  margin-left: 1px;
  vertical-align: middle;
}

/* 确保图标不会被截断 */
.message-content :deep(img) {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* 优化复制按钮悬停效果 */
.group:hover button {
  opacity: 1;
  transform: translateY(0);
}

button {
  transform: translateY(2px);
  transition: all 0.2s ease;
}

/* 添加流式响应相关样式 */
.streaming::after {
  content: "▋";
  display: inline-block;
  color: #3370ff;
  animation: blink 1s infinite;
  margin-left: 2px;
  font-weight: bold;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* PDF 导出样式优化 */
.pdf-export-container {
  display: none;
  background: white;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.pdf-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
}

/* 品牌头部样式 */
.brand-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.brand-logo {
  width: 48px;
  height: 48px;
}

.brand-info {
  flex: 1;
}

.brand-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.brand-slogan {
  font-size: 14px;
  color: #666;
}

/* 分割线样式 */
.divider {
  height: 1px;
  background: linear-gradient(to right, #3370ff, #e5e7eb);
  margin: 24px 0;
}

/* 聊天内容样式优化 */
.chat-content {
  padding: 20px 0;
}

.chat-group {
  margin-bottom: 40px;
}

.question-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 12px;
  padding-left: 16px;
}

.chat-bubble {
  margin-bottom: 16px;
  max-width: 90%;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-bubble {
  margin-left: auto;
  margin-right: 16px;
  background: #3370ff;
  color: white;
}

.ai-bubble {
  margin-left: 16px;
  border: 1px solid #e5e7eb;
}

.bubble-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.ai-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.ai-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.bubble-content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
}

/* Markdown 内容样式优化 */
.markdown-content {
  color: #333;
}

.markdown-content :deep(pre) {
  background: #f6f8fa;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
  font-family: Consolas, Monaco, "Courier New", monospace;
}

.markdown-content :deep(code) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
}

.markdown-content :deep(p) {
  margin: 8px 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  background: white;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}

.markdown-content :deep(th) {
  background: #f8f9fa;
  font-weight: 500;
}

/* 页脚样式 */
.chat-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #666;
  font-size: 12px;
}

.export-time {
  margin-bottom: 8px;
}

.copyright {
  color: #999;
}

/* 添加下拉菜单样式 */
:deep(.el-dropdown-menu) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg;
}

:deep(.el-dropdown-menu__item) {
  @apply text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
  line-height: 32px;
  padding: 0 16px;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  @apply bg-gray-100 dark:bg-gray-700;
  color: inherit;
}

:deep(.el-dropdown-menu__item i) {
  @apply text-base;
}

/* 修改下拉图标样式 */
.el-icon.el-icon--right {
  @apply ml-1 text-xs;
}
</style>
