<script setup lang="ts">
import { ref } from "vue";
import { ElCard, ElCollapse, ElCollapseItem, ElDivider } from "element-plus";
import { Icon } from "@iconify/vue"; // 引入 Icon 组件
import TerminalFill from "@iconify-icons/ri/terminal-fill"; // 引入 TerminalFill 图标

// 模拟 FAQ 数据
const faqList = ref([
  {
    id: 1,
    question: "如何注册账号？",
    answer: "您可以通过点击首页的“注册”按钮，填写相关信息完成账号注册。"
  },
  {
    id: 2,
    question: "忘记密码怎么办？",
    answer: "您可以在登录页面点击“忘记密码”，按照提示重置密码。"
  },
  {
    id: 3,
    question: "课程如何购买？",
    answer: "登录后，选择您感兴趣的课程，点击“立即购买”并完成支付即可。"
  },
  {
    id: 4,
    question: "课程支持退款吗？",
    answer: "在课程购买后的 7 天内，如果未学习超过 20% 的内容，可以申请退款。"
  },
  {
    id: 5,
    question: "如何联系客服？",
    answer:
      "您可以通过页面右下角的在线客服或发送邮件至 support@example.com 联系我们。"
  }
]);

// 当前展开的面板
const activeNames = ref<string[]>([]);

// 处理折叠面板的展开/收起
const handleChange = (val: string[]) => {
  activeNames.value = val;
};
</script>

<template>
  <el-card
    class="p-5 w-[1180px] shadow-md rounded-lg bg-white dark:bg-gray-800"
    shadow="never"
  >
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">常见问题</h2>
    </template>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="faq in faqList"
        :key="faq.id"
        :name="faq.id.toString()"
        class="mb-4"
      >
        <!-- 问题 -->
        <template #title>
          <span class="text-dark-600 dark:text-white">
            {{ faq.question }}
          </span>
        </template>
        <!-- 答案 -->
        <div class="text-gray-700 dark:text-gray-300 flex items-start">
          <!-- 回答内容 -->
          <span>{{ faq.answer }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 分割线 -->
    <el-divider />

    <!-- 提示信息 -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      如果以上问题未能解决您的疑问，请联系我们的客服。
    </p>
  </el-card>
</template>

<style scoped>
/* 自定义折叠面板样式 */
.el-collapse-item__header {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb; /* 添加底部边框 */
}

.el-collapse-item__content {
  padding: 12px 0;
}
</style>
