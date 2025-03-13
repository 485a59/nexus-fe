<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";
import "@/style/pdf-app.css";

import { useDark } from "@pureadmin/utils";

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
});

const { isDark } = useDark();

// PDF 配置
const pageScale = ref("page-fit");
const theme = computed(() => (isDark.value ? "dark" : "light"));
const fileName = ref("");

const config = ref({
  sidebar: {
    viewThumbnail: true,
    viewOutline: true,
    viewAttachments: false
  },
  secondaryToolbar: {
    secondaryPresentationMode: true,
    secondaryOpenFile: false,
    secondaryPrint: true,
    secondaryDownload: true,
    secondaryViewBookmark: false,
    firstPage: true,
    lastPage: true,
    pageRotateCw: false,
    pageRotateCcw: false,
    cursorSelectTool: false,
    cursorHandTool: false,
    scrollVertical: false,
    scrollHorizontal: false,
    scrollWrapped: false,
    spreadNone: false,
    spreadOdd: false,
    spreadEven: false,
    documentProperties: false
  },
  toolbar: {
    toolbarViewerLeft: {
      findbar: true,
      previous: true,
      next: true,
      pageNumber: true
    },
    toolbarViewerRight: {
      presentationMode: true,
      openFile: false,
      print: true,
      download: true,
      viewBookmark: false
    },
    toolbarViewerMiddle: {
      zoomOut: true,
      zoomIn: true,
      scaleSelectContainer: true
    }
  },
  errorWrapper: true
});
const viewerWidth = computed(() => "100%");
const viewerHeight = computed(() => "100%");

// 直接使用 props.pdfUrl
const pdfUrl = computed(() => props.pdfUrl);

// PDF 渲染完成回调
const pagesRendered = (pdfApp: any) => {
  console.log("PDF 渲染完成:", pdfApp);
};

// 初始化时加载第一个 PDF
onMounted(() => {
  if (pdfUrl.value) {
    // loadPdf(0);
  }
});
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800 justify-center">
    <div v-if="pdfUrl" class="h-full z-20 w-4/5 p-4">
      <VuePdfApp
        :pdf="pdfUrl"
        :page-scale="pageScale"
        :theme="theme"
        class="pdf-container"
        lang="zh"
        :config="config"
        :style="`width: ${viewerWidth}; height: ${viewerHeight};`"
        :fileName="fileName"
        @pages-rendered="pagesRendered"
      />
    </div>
    <div v-else class="flex items-center justify-center h-full w-4/5">
      <p class="text-gray-500 dark:text-gray-400">无法加载 PDF 文件</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(*) {
  box-sizing: content-box;
}

.pdf-container {
  border: 1px solid;
  border-color: rgb(209, 213, 219);
  .dark & {
    border-color: rgb(75, 85, 99);
  }
  border-radius: 0.5rem;
  overflow: hidden;
}

// 定制化主题色
:deep(.pdf-app.dark) {
  --pdf-app-background-color: rgb(31, 41, 55);
  --pdf-sidebar-content-color: rgb(17, 24, 39);
  --pdf-toolbar-sidebar-color: rgb(31, 41, 55);
  --pdf-toolbar-color: rgb(31, 41, 55);
  --pdf-loading-bar-color: #1677ff;
  --pdf-loading-bar-secondary-color: #4096ff;
  --pdf-find-results-count-color: rgb(55, 65, 81);
  --pdf-find-results-count-font-color: rgb(209, 213, 219);
  --pdf-find-message-font-color: rgb(209, 213, 219);
  --pdf-not-found-color: #ef4444;
  --pdf-toolbar-font-color: rgb(209, 213, 219);
  --pdf-button-hover-font-color: #1677ff;
  --pdf-button-toggled-color: rgb(55, 65, 81);
  --pdf-input-color: rgb(31, 41, 55);
  --pdf-input-font-color: rgb(209, 213, 219);
  --pdf-find-input-placeholder-font-color: rgb(156, 163, 175);
  --pdf-thumbnail-selection-ring-color: #1677ff;
  --pdf-thumbnail-selection-ring-selected-color: #1677ff;

  // 优化侧边栏样式
  :deep(.thumbnail) {
    border-radius: 0.25rem;
    border: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(255, 255, 255, 0.1);
    }

    &.selected {
      border-color: #1677ff;

      > .thumbnailSelectionRing {
        background-color: rgba(22, 119, 255, 0.2);
      }
    }
  }

  // 优化大纲样式
  :deep(.outlineItem) {
    > a {
      border-radius: 0.5rem;
      transition: all 0.2s;
      padding: 4px 8px;
      margin: 2px 4px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #1677ff;
      }
    }

    &.selected > a {
      background-color: rgba(22, 119, 255, 0.2);
      color: #1677ff;
      font-weight: 500;
    }
  }
}

:deep(.pdf-app.light) {
  --pdf-app-background-color: rgb(249, 250, 251);
  --pdf-sidebar-content-color: rgb(243, 244, 246);
  --pdf-toolbar-sidebar-color: rgb(249, 250, 251);
  --pdf-toolbar-color: rgb(249, 250, 251);
  --pdf-loading-bar-color: #1677ff;
  --pdf-loading-bar-secondary-color: #4096ff;
  --pdf-find-results-count-color: rgb(229, 231, 235);
  --pdf-find-results-count-font-color: rgb(55, 65, 81);
  --pdf-find-message-font-color: rgb(75, 85, 99);
  --pdf-not-found-color: #ef4444;
  --pdf-toolbar-font-color: rgb(55, 65, 81);
  --pdf-button-hover-font-color: #1677ff;
  --pdf-button-toggled-color: rgb(229, 231, 235);
  --pdf-input-color: white;
  --pdf-input-font-color: rgb(55, 65, 81);
  --pdf-find-input-placeholder-font-color: rgb(156, 163, 175);
  --pdf-thumbnail-selection-ring-color: #1677ff;
  --pdf-thumbnail-selection-ring-selected-color: #1677ff;

  // 优化侧边栏样式
  :deep(.thumbnail) {
    border-radius: 0.25rem;
    border: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(0, 0, 0, 0.1);
    }

    &.selected {
      border-color: #1677ff;

      > .thumbnailSelectionRing {
        background-color: rgba(22, 119, 255, 0.1);
      }
    }
  }

  // 优化大纲样式
  :deep(.outlineItem) {
    > a {
      border-radius: 0.5rem;
      transition: all 0.2s;
      padding: 4px 8px;
      margin: 2px 4px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;

      &:hover {
        background-color: rgba(22, 119, 255, 0.1);
        color: #1677ff;
      }
    }

    &.selected > a {
      background-color: rgba(22, 119, 255, 0.15);
      color: #1677ff;
      font-weight: 500;
    }

    // 优化子项缩进
    .outlineItem {
      margin-left: 16px;
    }
  }
}

// 通用样式优化
:deep(.pdf-app) {
  // 移除所有阴影
  * {
    box-shadow: none !important;
  }

  // 优化分隔线
  .vertical-toolbar-separator {
    background-color: currentColor;
    opacity: 0.1;
  }

  .sidebarContent {
    padding: 8px;
  }

  #outlineView {
    padding: 8px;

    .outlineItem {
      > a {
        display: block;
        border-radius: 0.5rem;
        padding: 6px 12px;
        margin: 4px 0;
        transition: all 0.2s ease;
        color: inherit;
        text-decoration: none;

        &:hover {
          background-color: rgba(22, 119, 255, 0.1);
          color: #1677ff !important;
        }
      }

      &.selected > a {
        background-color: rgba(22, 119, 255, 0.15);
        color: #1677ff !important;
        font-weight: 500;
      }
    }
  }

  .dark #outlineView {
    .outlineItem {
      > a:hover {
        background-color: rgba(22, 119, 255, 0.2);
      }

      &.selected > a {
        background-color: rgba(22, 119, 255, 0.25);
      }
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  .dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  // 优化按钮样式
  button {
    border-radius: 0.25rem;
    transition: all 0.2s;
  }

  // 优化输入框样式
  input[type="number"] {
    border-radius: 0.25rem;
    border: 1px solid transparent;
    transition: all 0.2s;

    &:focus {
      border-color: #1677ff;
    }
  }

  // 优化侧边栏切换按钮
  .toolbarButton#sidebarToggle {
    border-radius: 0.25rem;
  }

  // 优化缩放控件
  #scaleSelectContainer {
    border-radius: 0.25rem;
    select {
      border-radius: 0.25rem;
    }
  }
}
</style>
