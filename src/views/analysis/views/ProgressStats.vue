<template>
  <div class="progress-stats w-full space-y-6">
    <!-- 卡片：章节任务点详情 -->
    <el-card class="rounded-lg">
      <div class="flex justify-between items-center">
        <!-- 章节任务点详情 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            章节任务点详情
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <span class="text-3xl mr-1">{{ data.completedTasks }}</span> /
            {{ data.totalTasks }} 个
          </p>
        </div>

        <!-- 环形进度条 -->
        <div class="relative w-20 h-20">
          <el-progress
            type="circle"
            :percentage="data.progressPercentage"
            status="success"
            :width="80"
            :stroke-width="8"
          />
        </div>
      </div>

      <!-- 排名信息 -->
      <div class="mt-4 flex space-x-6">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">当前排名</p>
          <p class="text-lg text-gray-800 dark:text-gray-100">
            <span class="text-3xl mr-1">{{ data.currentRank }} </span>名
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">班级排名</p>
          <p class="text-lg text-gray-800 dark:text-gray-100">
            <span class="text-3xl mr-1">{{ data.classRank }}</span
            >名
          </p>
        </div>
      </div>
    </el-card>

    <!-- 在线学习详情 -->
    <el-card class="rounded-lg">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        在线学习详情
      </h3>

      <!-- 第一行：章节学习次数 -->
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          章节学习次数：{{ data.studyCount }} 次
        </p>
      </div>

      <!-- 第二行：学习任务 -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- 章节测验 -->
        <el-card class="rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300">章节测验</p>
          <p class="text-lg text-gray-900 dark:text-gray-100">
            <span class="text-xl text-blue-800">{{
              data.chapterTests?.completed
            }}</span>
            / {{ data.chapterTests?.total }}
          </p>
        </el-card>

        <!-- 在线考试 -->
        <el-card class="rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300">在线考试</p>
          <p class="text-lg text-gray-900 dark:text-gray-100">
            <span class="text-xl text-blue-800">{{
              data.onlineExams?.completed
            }}</span>
            / {{ data.onlineExams?.total }}
          </p>
        </el-card>

        <!-- 课程作业 -->
        <el-card class="rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300">课程作业</p>
          <p class="text-lg text-gray-900 dark:text-gray-100">
            <span class="text-xl text-blue-800">{{
              data.coursework?.completed
            }}</span>
            / {{ data.coursework?.total }}
          </p>
        </el-card>

        <!-- 互动测验 -->
        <el-card class="rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300">互动测验</p>
          <p class="text-lg text-gray-900 dark:text-gray-100">
            <span class="text-xl text-blue-800">{{
              data.interactiveQuizzes?.completed
            }}</span>
            / {{ data.interactiveQuizzes?.total }}
          </p>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

const data = ref({
  completedTasks: 21,
  totalTasks: 21,
  progressPercentage: 85,
  currentRank: 1,
  classRank: 5,
  studyCount: 47,
  chapterTests: { completed: 3, total: 3 },
  onlineExams: { completed: 0, total: 0 },
  coursework: { completed: 2, total: 3 },
  interactiveQuizzes: { completed: 0, total: 0 },
  groupTasks: { completed: 0, total: 0 },
  completedVideos: 15,
  totalVideos: 20
});

// 初始化图表
const initChart = () => {
  if (chart.value) {
    myChart = echarts.init(chart.value);
    // 手动设置图表的宽度和高度
    myChart.resize({
      width: chart.value.clientWidth || 800,
      height: chart.value.clientHeight || 400
    });
    updateChart();
  }
};

// 更新图表数据
const updateChart = () => {
  if (myChart) {
    const option = {
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: "学习进度",
          type: "pie",
          radius: "50%",
          data: [
            { value: data.value.progressPercentage, name: "已完成" },
            { value: 100 - data.value.progressPercentage, name: "未完成" }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }
};

// 初始化
onMounted(() => {
  nextTick(() => {
    initChart();
  });
  window.addEventListener("resize", () => {
    if (myChart) {
      myChart.resize();
    }
  });
});
</script>

<style scoped>
.progress-stats {
  max-width: 1200px;
  margin: 0 auto;
}

.chart-container {
  width: 100%;
  height: 400px; /* 设置一个明确的高度 */
}
</style>
