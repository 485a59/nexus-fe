<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-800 p-4">
    <!-- 分段控制器 -->
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="进度统计" name="progress">
        <ProgressStats :data="progressData" />
      </el-tab-pane>
      <el-tab-pane label="章节统计" name="chapter">
        <ChapterStats :data="chapterData" />
      </el-tab-pane>
      <el-tab-pane label="次数统计" name="count">
        <CountStats :data="countData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProgressStats from "./views/ProgressStats.vue";
import ChapterStats from "./views/ChapterStats.vue";
import CountStats from "./views/CountStats.vue";

// 当前激活的选项卡
const activeTab = ref("progress");

// 模拟数据
const progressData = ref({
  totalVideos: 10,
  completedVideos: 6,
  progressPercentage: 60
});

const chapterData = ref([
  { chapter: "第一章", progress: 80 },
  { chapter: "第二章", progress: 50 },
  { chapter: "第三章", progress: 30 }
]);

const countData = ref([
  { video: "视频 1", count: 5 },
  { video: "视频 2", count: 3 },
  { video: "视频 3", count: 8 },
  { video: "视频 4", count: 2 }
]);
</script>

<style scoped>
.el-tabs {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark .el-tabs {
  background: #1a1a1a;
  color: white;
}
</style>
