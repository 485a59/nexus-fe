<template>
  <div class="chapter-timeline">
    <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
      章节学习进度
    </h2>

    <!-- 时间线 -->
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in data"
        :key="index"
        :timestamp="item.timestamp"
        placement="top"
      >
        <el-card class="w-full" shadow="never">
          <div class="flex justify-between items-center">
            <div>
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-gray-100"
              >
                {{ item.chapter }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                学习进度：{{ item.progress }}%
              </p>
            </div>
            <el-progress
              :percentage="item.progress"
              :stroke-width="12"
              :color="progressColor(item.progress)"
            />
          </div>

          <!-- 章节详情 -->
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">已完成任务</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {{ item.completedTasks }} / {{ item.totalTasks }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">学习时长</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {{ item.studyTime }} 小时
              </p>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [
      {
        chapter: "第一章",
        progress: 80,
        completedTasks: 8,
        totalTasks: 10,
        studyTime: 5,
        timestamp: "2023-10-01"
      },
      {
        chapter: "第二章",
        progress: 60,
        completedTasks: 6,
        totalTasks: 10,
        studyTime: 3,
        timestamp: "2023-10-05"
      },
      {
        chapter: "第三章",
        progress: 40,
        completedTasks: 4,
        totalTasks: 10,
        studyTime: 2,
        timestamp: "2023-10-10"
      }
    ]
  }
});

// 根据进度值设置进度条颜色
const progressColor = (progress: number) => {
  if (progress >= 80) return "#67C23A"; // 绿色
  if (progress >= 50) return "#E6A23C"; // 橙色
  return "#F56C6C"; // 红色
};
</script>

<style scoped>
.chapter-timeline {
  max-width: 800px;
  margin: 0 auto;
}

.el-timeline-item :deep(.el-timeline-item__timestamp) {
  font-size: 14px;
  color: #666;
}

.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
