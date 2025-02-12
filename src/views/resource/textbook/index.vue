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
const showPdfViewer = ref(false);
const currentTextbook = ref(null);

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useTextbook();

// 打开PDF查看器
const handleOpenPdf = textbook => {
  currentTextbook.value = textbook;
  showPdfViewer.value = true;
};

// 关闭PDF查看器
const handleClosePdf = () => {
  showPdfViewer.value = false;
  currentTextbook.value = null;
};

// 初始化加载
onSearch();

// 当前展开的学科
const activeSubjects = ref([1]);

// 学科数据
const chapterList = ref([
  {
    id: 1,
    name: "信息技术",
    textbooks: [
      {
        id: 1,
        name: "Python程序设计",
        subject: "信息技术",
        type: "PDF",
        updateTime: "2024-03-21",
        url: "/preview/textbook/python-programming.pdf"
      },
      {
        id: 2,
        name: "Web开发基础",
        subject: "信息技术",
        type: "PDF",
        updateTime: "2024-03-20",
        url: "/preview/textbook/web-development.pdf"
      }
    ]
  },
  {
    id: 2,
    name: "数据科学",
    textbooks: [
      {
        id: 3,
        name: "数据分析实战",
        subject: "数据科学",
        type: "PDF",
        updateTime: "2024-03-19",
        url: "/preview/textbook/data-analysis.pdf"
      }
    ]
  }
]);

// 获取总教材数量
const getTotalTextbooks = () => {
  return chapterList.value.reduce(
    (total, subject) => total + subject.textbooks.length,
    0
  );
};

// 处理下载
const handleDownload = (textbook: any) => {
  ElMessage.info("下载功能待实现");
};
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- 左侧教材预览区域 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="currentTextbook" class="w-full">
        <!-- PDF 预览 -->
        <div
          class="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm"
        >
          <PdfViewer
            v-if="currentTextbook"
            :pdf-url="currentTextbook.url"
            class="w-full h-[700px]"
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
                  {{ currentTextbook.subject }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Files /></el-icon>
                  {{ currentTextbook.type }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Timer /></el-icon>
                  {{ currentTextbook.updateTime }}
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
          共 {{ chapterList.length }} 个学科 · {{ getTotalTextbooks() }} 本教材
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

      <!-- 学科列表 -->
      <div class="p-4">
        <el-collapse v-model="activeSubjects">
          <el-collapse-item
            v-for="subject in chapterList"
            :key="subject.id"
            :title="subject.name"
            :name="subject.id"
          >
            <div
              v-for="textbook in subject.textbooks"
              :key="textbook.id"
              @click="handleOpenPdf(textbook)"
              class="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-gray-800':
                  currentTextbook?.id === textbook.id
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
                    <span>{{ textbook.type }}</span>
                    <span>{{ textbook.updateTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
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
</style>
