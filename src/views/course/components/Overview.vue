<script setup lang="ts">
import { ref } from "vue";
import { ElCard, ElButton, ElTag, ElProgress } from "element-plus";
import CourseIcon from "@/assets/svg/course.svg?component";
import TargetIcon from "@/assets/svg/target.svg?component";
import SyllabusIcon from "@/assets/svg/syllabus.svg?component";

const courseOverview = ref({
  title: "农业信息技术课程",
  description:
    "本课程旨在帮助学生掌握农业信息技术的基本原理和应用，涵盖数据采集、分析、可视化等内容。",
  goals: ["掌握农业数据采集技术", "熟悉数据分析工具", "能够设计农业信息系统"],
  syllabus: [
    { title: "第一章：农业数据采集", progress: 30 },
    { title: "第二章：数据分析基础", progress: 50 },
    { title: "第三章：农业信息系统设计", progress: 70 }
  ],
  tags: ["农业", "信息技术", "数据分析"]
});
</script>

<template>
  <el-card class="w-[1180px] p-5" shadow="never">
    <template #header>
      <h2 class="text-2xl">{{ courseOverview.title }}</h2>
    </template>
    <!-- 课程简介 -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <CourseIcon class="w-6 h-6 mr-2 text-blue-500" />
        <span class="text-lg font-semibold text-gray-700">课程简介</span>
      </div>
      <p class="text-gray-600 leading-relaxed">
        {{ courseOverview.description }}
      </p>
    </div>
    <!-- 课程目标 -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <TargetIcon class="w-6 h-6 mr-2 text-green-500" />
        <span class="text-lg font-semibold text-gray-700">课程目标</span>
      </div>
      <ul class="space-y-2">
        <li
          v-for="(goal, index) in courseOverview.goals"
          :key="index"
          class="flex items-start text-gray-600"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
          <span class="flex-1">{{ goal }}</span>
        </li>
      </ul>
    </div>
    <!-- 课程大纲 -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <SyllabusIcon class="w-6 h-6 mr-2 text-purple-500" />
        <span class="text-lg font-semibold text-gray-700">课程大纲</span>
      </div>
      <div class="space-y-4">
        <div
          v-for="(item, index) in courseOverview.syllabus"
          :key="index"
          class="bg-gray-50 p-4 rounded-lg"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-700">{{ item.title }}</span>
          </div>
          <el-progress
            :percentage="item.progress"
            :stroke-width="8"
            :color="getProgressColor(item.progress)"
          />
        </div>
      </div>
    </div>

    <!-- 课程标签 -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <span class="text-lg font-semibold text-gray-700">课程标签</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <el-tag
          v-for="(tag, index) in courseOverview.tags"
          :key="index"
          type="info"
          class="text-sm"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-end">
      <el-button type="primary" class="w-32">开始学习</el-button>
      <el-button class="w-32 ml-4">了解更多</el-button>
    </div>
  </el-card>
</template>

<style scoped>
/* 自定义进度条颜色 */
:deep(.el-progress-bar__inner) {
  transition: all 0.3s ease;
}
</style>

<script lang="ts">
// 根据进度值返回进度条颜色
const getProgressColor = (progress: number) => {
  if (progress < 30) return "#f56c6c"; // 红色
  if (progress < 70) return "#e6a23c"; // 橙色
  return "#67c23a"; // 绿色
};
</script>
