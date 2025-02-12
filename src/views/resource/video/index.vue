<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- 左侧视频播放区域 -->
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="activeVideoUrl" class="w-full">
        <!-- 视频播放器 -->
        <div
          id="mse"
          class="w-full h-[600px] bg-black rounded-lg overflow-hidden"
        />

        <!-- 视频信息区域 -->
        <div class="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ activeVideo?.label }}
              </h1>
              <div
                class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <el-icon class="mr-1"><User /></el-icon>
                  {{ activeVideo?.lecturer }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Timer /></el-icon>
                  {{ activeVideo?.duration }}
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><View /></el-icon>
                  {{ activeVideo?.views || 0 }} 次观看
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <el-button type="primary" :icon="Download">下载讲义</el-button>
              <el-button :icon="Share">分享</el-button>
            </div>
          </div>

          <!-- 视频描述 -->
          <div class="mt-4 text-gray-600 dark:text-gray-300">
            {{ activeVideo?.description || "暂无描述" }}
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-gray-500 dark:text-gray-400">请从右侧选择视频</p>
      </div>
    </div>

    <!-- 右侧课程大纲 -->
    <div class="w-96 bg-white dark:bg-gray-900 rounded-lg overflow-y-auto">
      <!-- 课程信息头部 -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          视频资源库
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          共 12 章 · 48 节课 · 24 小时
        </p>
        <div class="mt-4 flex items-center">
          <el-progress
            :percentage="courseProgress"
            :format="format"
            class="flex-1"
          />
        </div>
      </div>

      <!-- 章节列表 -->
      <div class="p-4">
        <el-collapse v-model="activeChapters">
          <el-collapse-item
            v-for="chapter in chapterList"
            :key="chapter.id"
            :title="chapter.label"
            :name="chapter.id"
          >
            <div
              v-for="video in chapter.children"
              :key="video.id"
              @click="handleVideoClick(video)"
              class="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-gray-800': activeVideoIndex === video.id
              }"
            >
              <div class="flex items-start">
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 mr-3"
                >
                  <el-icon
                    :class="{
                      'text-green-500': isVideoCompleted(video.id),
                      'text-gray-400': !isVideoCompleted(video.id)
                    }"
                  >
                    <component
                      :is="isVideoCompleted(video.id) ? 'Check' : 'VideoPlay'"
                    />
                  </el-icon>
                </div>
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ video.label }}
                  </h4>
                  <div
                    class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2"
                  >
                    <span class="flex items-center">
                      <el-icon class="mr-1"><Timer /></el-icon>
                      {{ video.duration }}
                    </span>
                    <span class="flex items-center">
                      <el-icon class="mr-1"><User /></el-icon>
                      {{ video.lecturer }}
                    </span>
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
import { ref, computed, onMounted } from "vue";
import Player from "xgplayer";
import "xgplayer/dist/index.min.css";
import {
  VideoPlay,
  User,
  Timer,
  View,
  Share,
  Download,
  Check
} from "@element-plus/icons-vue";

// 当前展开的章节
const activeChapters = ref([1]);

// 课程进度
const courseProgress = ref(35);
const format = (percentage: number) => `已学习 ${percentage}%`;

// 视频完成状态
const completedVideos = ref(new Set([2]));
const isVideoCompleted = (id: number) => completedVideos.value.has(id);

// 章节树状结构数据
const chapterList = ref([
  {
    id: 1,
    label: "第一章 前端工程化基础",
    children: [
      {
        id: 2,
        label: "1.1 现代前端开发概述",
        url: "//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4",
        poster: "https://via.placeholder.com/800x450",
        duration: "12:34",
        lecturer: "张三",
        description:
          "本节课介绍现代前端开发的基本概念和工具链，帮助你理解前端工程化的重要性。",
        views: 1234
      },
      {
        id: 3,
        label: "1.2 Node.js与npm基础",
        url: "https://www.w3schools.com/html/movie.mp4",
        poster: "https://via.placeholder.com/800x450",
        duration: "15:21",
        lecturer: "李四",
        description: "深入理解Node.js运行时环境和npm包管理工具的使用方法。",
        views: 956
      }
    ]
  },
  {
    id: 4,
    label: "第二章 Vue3核心概念",
    children: [
      {
        id: 5,
        label: "2.1 组合式API详解",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        poster: "https://via.placeholder.com/800x450",
        duration: "20:15",
        lecturer: "王五",
        description: "全面讲解Vue3组合式API的使用方法和最佳实践。",
        views: 2341
      }
    ]
  }
]);

// 当前选中的视频索引、URL 和封面
const activeVideoIndex = ref<number | null>(null);
const activeVideoUrl = ref<string | null>(null);
const activeVideoPoster = ref<string | null>(null);
const activeVideo = ref<any>(null);

// 初始化播放器实例
let player: Player | null = null;

// 加载视频
const loadVideo = (url: string, poster: string, id: number) => {
  activeVideoIndex.value = id;
  activeVideoUrl.value = url;
  activeVideoPoster.value = poster;

  // 销毁旧的播放器实例
  if (player) {
    player.destroy();
  }

  // 初始化新的播放器实例
  player = new Player({
    id: "mse",
    url: activeVideoUrl.value,
    poster: activeVideoPoster.value,
    lang: "zh",
    volume: 0, // 默认静音
    autoplay: false,
    screenShot: true,
    fluid: false, // 固定大小，不随容器变化
    width: "100%", // 宽度占满容器
    height: "600px", // 固定高度
    videoAttributes: {
      crossOrigin: "anonymous"
    },
    playbackRate: [0.5, 0.75, 1, 1.5, 2] // 倍速选项
  });
};

// 处理视频点击
const handleVideoClick = (video: any) => {
  activeVideoIndex.value = video.id;
  activeVideoUrl.value = video.url;
  activeVideo.value = video;

  if (player) {
    player.destroy();
  }

  player = new Player({
    id: "mse",
    url: video.url,
    poster: video.poster,
    lang: "zh",
    volume: 0.6,
    autoplay: false,
    screenShot: true,
    fluid: false,
    width: "100%",
    height: "600px",
    videoAttributes: {
      crossOrigin: "anonymous"
    },
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
};

// 初始化时加载第一个视频
onMounted(() => {
  if (chapterList.value.length > 0 && chapterList.value[0].children) {
    const firstVideo = chapterList.value[0].children[0];
    handleVideoClick(firstVideo);
  }
});
</script>

<style lang="scss" scoped>
:deep(*) {
  box-sizing: content-box;
}

// 定制化主题色
.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.light {
  background-color: #ffffff;
  color: #000000;
}

// 播放器容器样式
#mse {
  width: 100%;
  height: 600px; // 固定高度
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

// 树状结构样式
.el-tree {
  background-color: transparent;

  :deep(.el-tree-node__content) {
    padding: 8px 0;

    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: rgba(59, 130, 246, 0.1);
  }
}

.el-progress {
  :deep(.el-progress-bar__outer) {
    background-color: #e5e7eb;
  }
}
</style>
