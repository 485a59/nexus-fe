<script setup lang="ts">
import { useSoftware } from "./hooks";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  Search,
  Download,
  Monitor,
  Timer,
  Platform,
  ArrowRight
} from "@element-plus/icons-vue";
import SoftwareIcon from "./components/SoftwareIcon.vue";
import EmptySelect from "@/assets/images/empty-select.svg";

defineOptions({
  name: "ResourceSoftware"
});

const {
  activeCategories,
  currentSoftware,
  searchKeyword,
  softwareList,
  getTotalSoftware,
  handleDownload,
  handleSelectSoftware,
  handleSearch,
  initSoftware,
  formatFileSize,
  formatTime
} = useSoftware();

// 初始化加载
initSoftware();
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- 左侧软件详情区域 -->
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="currentSoftware" class="w-full">
        <!-- 软件详情卡片 -->
        <div class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ currentSoftware.name }}
              </h1>
              <div
                class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <el-icon class="mr-1"><Monitor /></el-icon>
                  {{ currentSoftware.platform }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Platform /></el-icon>
                  v{{ currentSoftware.version }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Timer /></el-icon>
                  {{ formatTime(currentSoftware.updateTime) }}
                </span>
              </div>
              <p class="mt-4 text-gray-600 dark:text-gray-400">
                {{ currentSoftware.description }}
              </p>
            </div>
            <el-button
              type="primary"
              :icon="Download"
              @click="handleDownload(currentSoftware)"
            >
              下载 ({{ formatFileSize(currentSoftware.size) }})
            </el-button>
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
                请从右侧选择资源
              </h3>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
              >
                在右侧列表中点击任意资源项目，即可在此处查看详细信息
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

    <!-- 右侧软件列表 -->
    <div class="w-96 bg-white dark:bg-gray-900 rounded-lg overflow-y-auto">
      <!-- 软件库信息头部 -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          软件资源库
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          共 {{ softwareList.length }} 个分类 · {{ getTotalSoftware() }} 个软件
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索软件"
          :prefix-icon="Search"
          clearable
        />
      </div>

      <!-- 软件列表 -->
      <div class="p-4 pt-0">
        <el-collapse v-model="activeCategories">
          <el-collapse-item
            v-for="category in softwareList"
            :key="category.id"
            :title="category.name"
            :name="category.id"
          >
            <div
              v-for="software in category.software"
              :key="software.id"
              @click="handleSelectSoftware(software)"
              class="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-gray-800':
                  currentSoftware?.id === software.id
              }"
            >
              <div class="flex items-start">
                <div class="w-12 h-12 mr-3">
                  <SoftwareIcon :text="software.name" />
                </div>
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ software.name }}
                  </h4>
                  <div
                    class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2"
                  >
                    <span>v{{ software.version }}</span>
                    <span>{{ software.size }}</span>
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
</style>
