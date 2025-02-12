<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- 左侧 PPT 预览区域 -->
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="currentPPT" class="w-full">
        <!-- PPT 预览 -->
        <div
          class="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm"
        >
          <iframe
            v-if="currentPPT.previewUrl"
            :src="currentPPT.previewUrl"
            frameborder="0"
            class="w-full h-[600px]"
          ></iframe>
          <div
            v-else
            class="flex items-center justify-center h-[600px] text-gray-400"
          >
            暂无预览
          </div>
        </div>

        <!-- PPT 信息区域 -->
        <div class="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ currentPPT.name }}
              </h1>
              <div
                class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <el-icon class="mr-1"><User /></el-icon>
                  {{ currentPPT.author }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Timer /></el-icon>
                  {{ currentPPT.updateTime }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Files /></el-icon>
                  {{ currentPPT.size }}
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <el-button
                type="primary"
                :icon="Download"
                @click="handleDownload(currentPPT)"
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
                请从右侧选择PPT
              </h3>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
              >
                在右侧列表中点击任意PPT项目，即可在此处查看详细信息
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

    <!-- 右侧章节列表 -->
    <div class="w-96 bg-white dark:bg-gray-900 overflow-y-auto rounded-lg">
      <!-- 课程信息头部 -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          PPT课件资源库
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          共 {{ chapterList.length }} 章 · {{ getTotalPPTs() }} 个PPT
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <el-input
          v-model="searchParams.keyword"
          placeholder="搜索PPT"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- 章节列表 -->
      <div class="p-4">
        <el-collapse v-model="activeChapters">
          <el-collapse-item
            v-for="chapter in chapterList"
            :key="chapter.id"
            :title="chapter.name"
            :name="chapter.id"
          >
            <div
              v-for="ppt in chapter.ppts"
              :key="ppt.id"
              @click="handlePreview(ppt)"
              class="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-gray-800': currentPPT?.id === ppt.id
              }"
            >
              <div class="flex items-start">
                <div class="w-12 h-12 mr-3">
                  <PPTIcon :text="ppt.name" />
                </div>
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ ppt.name }}
                  </h4>
                  <div
                    class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2"
                  >
                    <span>{{ ppt.updateTime }}</span>
                    <span>{{ ppt.size }}</span>
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

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Search,
  Download,
  Share,
  User,
  Timer,
  Files,
  ArrowRight
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import PPTIcon from "./components/PPTIcon.vue";
import EmptySelect from "@/assets/images/empty-select.svg";

defineOptions({
  name: "ResourcePPT"
});

// 当前展开的章节
const activeChapters = ref([1]);
const currentPPT = ref<any>(null);
const searchParams = ref({
  keyword: ""
});

// 章节数据
const chapterList = ref([
  {
    id: 1,
    name: "第一章 前端基础",
    ppts: [
      {
        id: 1,
        name: "HTML5基础",
        author: "张三",
        updateTime: "2024-03-21",
        size: "2.5MB",
        previewUrl: "/preview/ppt/html5-basics.pdf"
      },
      {
        id: 2,
        name: "CSS3新特性",
        author: "李四",
        updateTime: "2024-03-20",
        size: "1.8MB",
        previewUrl: "/preview/ppt/css3-features.pdf"
      }
    ]
  },
  {
    id: 2,
    name: "第二章 JavaScript进阶",
    ppts: [
      {
        id: 3,
        name: "ES6+特性详解",
        author: "王五",
        updateTime: "2024-03-19",
        size: "1.2MB",
        previewUrl: "/preview/ppt/es6-features.pdf"
      }
    ]
  }
]);

// 获取总PPT数量
const getTotalPPTs = () => {
  return chapterList.value.reduce(
    (total, chapter) => total + chapter.ppts.length,
    0
  );
};

// 处理预览
const handlePreview = (ppt: any) => {
  currentPPT.value = ppt;
};

// 处理下载
const handleDownload = (ppt: any) => {
  ElMessage.success(`开始下载 ${ppt.name}`);
  const link = document.createElement("a");
  link.href = ppt.previewUrl;
  link.download = ppt.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 处理搜索
const handleSearch = () => {
  ElMessage.info("搜索功能待实现");
};
</script>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
