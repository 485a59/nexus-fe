<script setup lang="ts">
import { useTextbook } from "./utils/hook";
import { ref, computed } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import PdfViewer from "./PdfViewer.vue";

import {
  Search,
  Download,
  Share,
  Document,
  Timer,
  Files
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Close from "@iconify-icons/ep/close";
import BookIcon from "./components/BookIcon.vue";
import EmptySelect from "@/assets/images/empty-select.svg";
import { ArrowRight } from "@element-plus/icons-vue";

defineOptions({
  name: "ResourceTextbook"
});

const formRef = ref();

const {
  form,
  loading,
  dataList,
  currentTextbook,
  showPdfViewer,
  onSearch,
  resetForm,
  handleDelete,
  handleOpenPdf,
  handleClosePdf,
  handleDownload,
  handleSelectionChange,
  getTotalTextbooks
} = useTextbook();

// 初始化加载
onSearch();
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- 左侧教材预览区域 -->
    <div class="flex-[2] overflow-y-auto">
      <div v-if="currentTextbook" class="w-full">
        <!-- PDF 预览 -->
        <div
          class="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm"
        >
          <PdfViewer
            v-if="showPdfViewer && currentTextbook"
            :pdf-url="currentTextbook.url"
            class="w-full h-[800px]"
          />
        </div>

        <!-- 教材信息区域 -->
        <div class="mt-4 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ currentTextbook.name }}
              </h1>
              <div
                class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <el-icon class="mr-1"><Document /></el-icon>
                  {{ currentTextbook.publisher }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Files /></el-icon>
                  {{ currentTextbook.author }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Timer /></el-icon>
                  第{{ currentTextbook.edition }}版
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <el-button
                type="primary"
                :icon="Download"
                @click="handleDownload(currentTextbook)"
              >
                下载
              </el-button>
              <el-button :icon="Share">分享</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full">
        <el-empty :image-size="200" description="">
          <template #image>
            <div class="flex flex-col items-center">
              <EmptySelect />
            </div>
          </template>
          <template #description>
            <div class="text-center">
              <h3
                class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                请从右侧选择教材
              </h3>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
              >
                在右侧列表中点击任意教材项目，即可在此处查看详细信息
              </p>
              <div
                class="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-400"
              >
                <el-icon class="text-lg"><ArrowRight /></el-icon>
                <span>向右滑动查看更多</span>
              </div>
            </div>
          </template>
        </el-empty>
      </div>
    </div>

    <!-- 右侧教材列表 -->
    <div class="w-96 bg-white dark:bg-gray-900 overflow-y-auto rounded-lg">
      <!-- 教材信息头部 -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          教材资源库
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          共 {{ getTotalTextbooks() }} 本教材
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <el-input
          v-model="form.name"
          placeholder="搜索教材"
          :prefix-icon="Search"
          clearable
          @keyup.enter="onSearch"
        />
      </div>

      <!-- 教材列表 -->
      <div class="p-4">
        <!-- 加载中的骨架屏 -->
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="animate-pulse mb-3">
            <div
              class="flex items-start p-3 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <div
                class="w-12 h-12 mr-3 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
              <div class="flex-1">
                <div
                  class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"
                ></div>
                <div class="flex space-x-2">
                  <div
                    class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"
                  ></div>
                  <div
                    class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"
                  ></div>
                  <div
                    class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 实际的教材列表 -->
        <template v-else>
          <div
            v-for="textbook in dataList"
            :key="textbook.id"
            @click="handleOpenPdf(textbook)"
            class="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 mb-3"
            :class="{
              'bg-blue-50 dark:bg-gray-800': currentTextbook?.id === textbook.id
            }"
          >
            <div class="flex items-start">
              <div class="w-12 h-12 mr-3">
                <BookIcon :text="textbook.name" />
              </div>
              <div class="flex-1">
                <h4
                  class="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {{ textbook.name }}
                </h4>
                <div
                  class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2"
                >
                  <span>{{ textbook.publisher }}</span>
                  <span>{{ textbook.author }}</span>
                  <span>第{{ textbook.edition }}版</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.pdf-viewer-container {
  z-index: 100;
}

:deep(.pure-table) {
  .el-table__row {
    cursor: pointer;

    &:hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }

  // 添加表格圆角
  .el-table {
    border-radius: 0.5rem;
    overflow: hidden;
  }

  // 确保内部边框不会超出圆角
  .el-table__inner-wrapper {
    border-radius: 0.5rem;
    overflow: hidden;
  }
}

// 确保整个表格容器也有圆角
.pure-table {
  border-radius: 0.5rem;
  overflow: hidden;
}

// 骨架屏动画
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

// 骨架屏渐变效果
.bg-gray-200 {
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

// 暗色模式适配
.dark {
  .bg-gray-200::after {
    background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0,
      rgba(255, 255, 255, 0.05) 20%,
      rgba(255, 255, 255, 0.1) 60%,
      rgba(0, 0, 0, 0)
    );
  }
}
</style>
