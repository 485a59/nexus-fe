<script setup lang="ts">
import { ref } from "vue";
import { ElCard, ElProgress } from "element-plus";

// 模拟评分标准数据
const criteriaTree = ref([
  {
    id: 1,
    title: "课程参与度评分标准",
    percentage: 30, // 占比
    color: "#409EFF", // 颜色
    children: [
      {
        id: 11,
        title: "课堂发言",
        content: "积极参与课堂讨论，提出有建设性的问题或建议。"
      },
      {
        id: 12,
        title: "小组合作",
        content: "在小组活动中表现积极，能够有效沟通和协作。"
      }
    ]
  },
  {
    id: 2,
    title: "作业完成度评分标准",
    percentage: 40, // 占比
    color: "#67C23A", // 颜色
    children: [
      {
        id: 21,
        title: "作业提交时间",
        content: "按时提交作业，延迟提交将扣分。"
      },
      {
        id: 22,
        title: "作业质量",
        content: "作业内容完整，逻辑清晰，符合要求。"
      }
    ]
  },
  {
    id: 3,
    title: "期末考试评分标准",
    percentage: 30, // 占比
    color: "#E6A23C", // 颜色
    children: [
      {
        id: 31,
        title: "答题准确率",
        content: "答案准确无误，逻辑严谨。"
      },
      {
        id: 32,
        title: "答题完整性",
        content: "答案完整，涵盖所有要点。"
      }
    ]
  }
  // 更多评分标准...
]);
</script>

<template>
  <el-card
    class="p-5 w-[1180px] shadow-md rounded-lg bg-white dark:bg-gray-800"
    shadow="never"
  >
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">评分标准</h2>
    </template>

    <div class="space-y-4">
      <el-card
        v-for="criteria in criteriaTree"
        :key="criteria.id"
        class="border-l-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex">
          <!-- 左侧内容（标题和子节点） -->
          <div class="flex-1">
            <!-- 父节点标题 -->
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ criteria.title }}
              </span>
            </div>

            <!-- 子节点 -->
            <div class="mt-4 space-y-3 pl-6">
              <div
                v-for="child in criteria.children"
                :key="child.id"
                class="flex items-start"
              >
                <span
                  class="w-2 h-2 rounded-full mt-2 mr-3"
                  :style="{ backgroundColor: criteria.color }"
                ></span>
                <div>
                  <h3
                    class="text-base font-medium text-gray-800 dark:text-gray-200"
                  >
                    {{ child.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ child.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧进度条 -->
          <div class="flex items-center justify-center ml-4">
            <div class="relative">
              <el-progress
                type="dashboard"
                :percentage="criteria.percentage"
                :color="criteria.color"
                :width="80"
                :stroke-width="10"
              />
              <span
                class="absolute inset-0 flex items-center justify-center text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </el-card>
</template>
