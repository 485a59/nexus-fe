<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- 左侧视频播放区域 -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="activeVideoUrl" class="w-full">
        <!-- 视频播放器 -->
        <div
          id="mse"
          class="w-full h-[600px] bg-black rounded-lg overflow-hidden shadow-sm"
        />

        <!-- 视频信息区域 -->
        <div class="mt-4 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ activeVideo?.name }}
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
                请从右侧选择视频资源
              </h3>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
              >
                在右侧列表中点击任意视频，即可在此处查看详细信息
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

    <!-- 右侧课程大纲 -->
    <div class="w-96 bg-white dark:bg-gray-900 overflow-y-auto rounded-lg">
      <!-- 课程信息头部 -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          视频资源库
        </h2>
        <div class="mt-2 flex items-center justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            共 {{ chapterList.length }} 章 · {{ getTotalVideos() }} 个视频
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            已学习 {{ courseProgress }}%
          </p>
        </div>
        <div class="mt-2">
          <el-progress
            :percentage="courseProgress"
            :show-text="false"
            class="flex-1"
            :stroke-width="4"
          />
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索视频"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- 章节列表 -->
      <div class="p-4 pt-0">
        <el-collapse v-model="activeChapters">
          <el-collapse-item
            v-for="chapter in chapterList"
            :key="chapter.id"
            :name="chapter.id"
          >
            <template #title>
              <div class="flex items-center">
                <el-icon class="mr-2">
                  <Folder :class="{ 'text-gray-400': !hasVideos(chapter) }" />
                </el-icon>
                <span
                  class="text-sm truncate"
                  :class="[
                    hasVideos(chapter)
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                  ]"
                >
                  {{ chapter.name }}
                  <span v-if="hasVideos(chapter)" class="video-count">
                    {{ countChapterVideos(chapter) }}
                  </span>
                </span>
              </div>
            </template>

            <template v-for="item in chapter.children" :key="item.id">
              <div
                v-if="item.url"
                @click="handleVideoClick(item)"
                class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="[
                  'cursor-pointer',
                  activeVideoIndex === item.id && 'bg-blue-50 dark:bg-gray-800'
                ]"
              >
                <div class="flex items-center">
                  <el-icon
                    class="mr-2 text-xs"
                    :class="[
                      'text-blue-500',
                      isVideoCompleted(item.id) && 'text-green-500'
                    ]"
                  >
                    <component
                      :is="isVideoCompleted(item.id) ? 'Check' : 'VideoPlay'"
                    />
                  </el-icon>
                  <div class="flex-1 min-w-0">
                    <h4
                      class="text-xs font-normal truncate"
                      :class="[
                        item.url
                          ? 'text-gray-700 dark:text-gray-200'
                          : 'text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ item.name }}
                    </h4>
                    <div
                      v-if="item.url"
                      class="mt-1 flex items-center text-xs text-gray-400 dark:text-gray-500 space-x-2"
                    >
                      <span
                        v-if="item.duration"
                        class="flex items-center text-[10px]"
                      >
                        <el-icon class="mr-1 text-[10px]"><Timer /></el-icon>
                        {{ item.duration }}
                      </span>
                      <span
                        v-if="item.lecturer"
                        class="flex items-center text-[10px]"
                      >
                        <el-icon class="mr-1 text-[10px]"><User /></el-icon>
                        {{ item.lecturer }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <el-collapse-item v-else :name="item.id" class="ml-4">
                <template #title>
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Folder :class="{ 'text-gray-400': !hasVideos(item) }" />
                    </el-icon>
                    <span
                      class="text-sm truncate"
                      :class="[
                        hasVideos(item)
                          ? 'text-gray-600 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-500'
                      ]"
                    >
                      {{ item.name }}
                      <span v-if="hasVideos(item)" class="video-count">
                        {{ countChapterVideos(item) }}
                      </span>
                    </span>
                  </div>
                </template>

                <template v-for="subItem in item.children" :key="subItem.id">
                  <div
                    v-if="subItem.url"
                    @click="handleVideoClick(subItem)"
                    class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    :class="[
                      'cursor-pointer',
                      activeVideoIndex === subItem.id &&
                        'bg-blue-50 dark:bg-gray-800'
                    ]"
                  >
                    <div class="flex items-center">
                      <el-icon
                        class="mr-2 text-xs"
                        :class="[
                          'text-blue-500',
                          isVideoCompleted(subItem.id) && 'text-green-500'
                        ]"
                      >
                        <component
                          :is="
                            isVideoCompleted(subItem.id) ? 'Check' : 'VideoPlay'
                          "
                        />
                      </el-icon>
                      <div class="flex-1 min-w-0">
                        <h4
                          class="text-xs font-normal truncate"
                          :class="[
                            subItem.url
                              ? 'text-gray-600 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-500'
                          ]"
                        >
                          {{ subItem.name }}
                        </h4>
                        <div
                          v-if="subItem.url"
                          class="mt-1 flex items-center text-xs text-gray-400 dark:text-gray-500 space-x-2"
                        >
                          <span
                            v-if="subItem.duration"
                            class="flex items-center text-[10px]"
                          >
                            <el-icon class="mr-1 text-[10px]"
                              ><Timer
                            /></el-icon>
                            {{ subItem.duration }}
                          </span>
                          <span
                            v-if="subItem.lecturer"
                            class="flex items-center text-[10px]"
                          >
                            <el-icon class="mr-1 text-[10px]"><User /></el-icon>
                            {{ subItem.lecturer }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-collapse-item v-else :name="subItem.id" class="ml-4">
                    <template #title>
                      <div class="flex items-center">
                        <el-icon class="mr-2">
                          <Folder
                            :class="{ 'text-gray-400': !hasVideos(subItem) }"
                          />
                        </el-icon>
                        <span
                          class="text-sm truncate"
                          :class="[
                            hasVideos(subItem)
                              ? 'text-gray-600 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-500'
                          ]"
                          :title="subItem.name"
                        >
                          {{ subItem.name }}
                          <span v-if="hasVideos(subItem)" class="video-count">
                            {{ countChapterVideos(subItem) }}
                          </span>
                        </span>
                      </div>
                    </template>
                  </el-collapse-item>
                </template>
              </el-collapse-item>
            </template>
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
import EmptySelect from "@/assets/images/empty-select.svg";

import {
  VideoPlay,
  User,
  Timer,
  View,
  Share,
  Download,
  Check,
  Folder,
  Document,
  Search
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getVideoTree } from "@/api/curriculum";
import ReText from "@/components/ReText";

// 当前展开的章节
const activeChapters = ref([1]);

// 课程进度
const courseProgress = ref(35);
const format = (percentage: number) => `已学习 ${percentage}%`;

// 视频完成状态
const completedVideos = ref(new Set([2]));
const isVideoCompleted = (id: number) => completedVideos.value.has(id);

// 章节树状结构数据
const chapterList = ref([]);

// 递归检查是否为叶子节点（没有children或children为空数组）
const isLeafNode = (item: any) => {
  return !item.children || item.children.length === 0;
};

// 递归处理视频时长
const processVideoDuration = async (items: any[]) => {
  for (const item of items) {
    if (item.url) {
      // 如果有url，获取视频时长
      try {
        const video = document.createElement("video");
        video.src = item.url;
        await new Promise((resolve, reject) => {
          video.addEventListener("loadedmetadata", () => {
            const duration = Math.floor(video.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            item.duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            resolve(null);
          });
          video.addEventListener("error", reject);
        });
      } catch (error) {
        console.error("获取视频时长失败:", error);
        item.duration = "--:--";
      }
    }
    if (item.children && item.children.length > 0) {
      await processVideoDuration(item.children);
    }
  }
};

// 修改获取视频树数据的方法
const fetchVideoTree = async () => {
  try {
    const { data } = await getVideoTree();
    // 处理视频时长
    await processVideoDuration(data);
    chapterList.value = data;
  } catch (error) {
    ElMessage.error("获取视频列表失败");
  }
};

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
  if (!video.url) return;

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
  console.log(player);
};

// 初始化时加载第一个视频
onMounted(async () => {
  await fetchVideoTree();
  // 如果有视频数据，加载第一个视频
  if (chapterList.value.length > 0) {
    const firstChapter = chapterList.value[0];
    const firstVideo = firstChapter.children?.find(item => item.url);
    if (firstVideo) {
      handleVideoClick(firstVideo);
    }
  }
});

// 添加获取视频总数的方法
const getTotalVideos = () => {
  let count = 0;
  const countVideos = (items: any[]) => {
    items.forEach(item => {
      if (item.url) {
        count++;
      }
      if (item.children && item.children.length > 0) {
        countVideos(item.children);
      }
    });
  };
  countVideos(chapterList.value);
  return count;
};

// 添加搜索功能相关变量
const searchKeyword = ref("");
const handleSearch = () => {
  ElMessage.info("搜索功能待实现");
};

// 检查章节是否包含视频
const hasVideos = (item: any): boolean => {
  if (item.url) return true;
  if (!item.children) return false;
  return item.children.some((child: any) => hasVideos(child));
};

// 计算章节包含的视频数量
const countChapterVideos = (item: any): number => {
  let count = 0;
  if (item.url) count++;
  if (item.children) {
    item.children.forEach((child: any) => {
      count += countChapterVideos(child);
    });
  }
  return count;
};
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

.chapter-list {
  :deep(.el-collapse) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    border: none;
    height: 40px;
    padding: 0 1rem;
    font-size: 13px;
    overflow: hidden;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    // 标题容器样式
    .flex.items-center {
      width: 100%;
      min-width: 0;
    }

    // 文本省略样式
    .text-sm {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 8px;
    }

    // 视频数量标记
    .video-count {
      flex-shrink: 0;
    }
  }

  // 子章节缩进和样式
  .ml-4 {
    :deep(.el-collapse-item__header) {
      padding-left: 2rem; // 增加子章节的缩进
    }

    .ml-4 {
      :deep(.el-collapse-item__header) {
        padding-left: 3rem; // 更深层级的缩进
      }
    }
  }
}

// 视频项目样式
.cursor-pointer {
  .flex-1 {
    min-width: 0;

    h4 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// 优化滚动条
.overflow-y-auto {
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

// 优化进度条
.el-progress {
  :deep(.el-progress-bar__outer) {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  :deep(.el-progress-bar__inner) {
    border-radius: 4px;
    transition: all 0.3s;
  }
}

// 优化整体布局
.flex.h-screen {
  padding: 1rem;
  gap: 1rem;
  background-color: rgb(243, 244, 246);

  .dark & {
    background-color: rgb(31, 41, 55);
  }
}

// 视频数量标记样式
.video-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  margin-left: 8px;
  font-size: 11px;
  line-height: 1;
  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: 8px;
  transform: scale(0.9);
  transform-origin: left center;
  flex-shrink: 0; // 防止被压缩
}

// 暗色模式适配
.dark {
  .video-count {
    background-color: var(--el-color-primary-light-3);
  }

  :deep(.el-collapse-item__header):hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
}
</style>
