<template>
  <div class="min-h-full flex flex-col">
    <div class="flex-1 flex flex-col items-center justify-center">
      <div class="flex items-center justify-center mb-2">
        <div class="w-48 h-48 flex items-center justify-center">
          <Question />
        </div>
      </div>

      <div class="text-center max-w-2xl">
        <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          输入您想了解的内容，我会为您找到最相关的资源
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <div
            v-for="example in examples"
            :key="example"
            class="text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-blue-50 dark:hover:bg-[#3370FF]/20 transition-colors"
            @click="$emit('select', example)"
          >
            "{{ example }}"
          </div>
        </div>

        <!-- 添加刷新按钮 -->
        <button
          class="mt-4 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mx-auto"
          @click="$emit('refresh')"
        >
          <el-icon class="text-base"><Refresh /></el-icon>
          换一批
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Question from "@/assets/svg/question.svg";
import { Refresh } from "@element-plus/icons-vue";

// 接收父组件传递的示例
defineProps<{
  examples: string[];
}>();

// 定义事件
defineEmits<{
  (e: "select", example: string): void;
  (e: "refresh"): void;
}>();
</script>
