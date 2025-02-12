<script setup lang="ts">
import { ref, computed } from "vue";
import { ElCard, ElPagination } from "element-plus";

// 模拟通知数据
const notifications = ref([
  {
    id: 1,
    title: "系统更新通知",
    content: "系统将于今晚 10 点进行维护更新，请提前保存数据。",
    date: "2023-10-01"
  },
  {
    id: 2,
    title: "新功能上线",
    content: "新增课程评价功能，欢迎体验并提供反馈。",
    date: "2023-10-02"
  },
  {
    id: 3,
    title: "安全提醒",
    content: "请及时修改密码以保障账户安全。",
    date: "2023-10-03"
  },
  {
    id: 4,
    title: "活动通知",
    content: "双十一优惠活动即将开始，敬请期待。",
    date: "2023-10-04"
  },
  {
    id: 5,
    title: "课程提醒",
    content: "您的课程《Vue 3 高级开发》将于明天开课。",
    date: "2023-10-05"
  }
  // 更多通知...
]);

// 分页相关逻辑
const pageSize = ref(5); // 每页显示的通知数量
const currentPage = ref(1); // 当前页码

// 计算当前页显示的通知
const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return notifications.value.slice(start, end);
});

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <el-card
    class="p-5 w-[1180px] shadow-md rounded-lg bg-white dark:bg-gray-800"
    shadow="never"
  >
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">通知中心</h2>
    </template>

    <div class="flex flex-col gap-4 mb-5">
      <div
        v-for="notification in paginatedNotifications"
        :key="notification.id"
        class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-shadow hover:shadow-md"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ notification.title }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ notification.date }}
          </span>
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300 leading-6">
          {{ notification.content }}
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-5">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="notifications.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </el-card>
</template>
