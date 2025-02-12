<script setup lang="ts">
import { ref, computed } from "vue";
import {
  ElCard,
  ElPagination,
  ElInput,
  ElButton,
  ElRate,
  ElMessage,
  ElDivider,
  ElSelect,
  ElOption
} from "element-plus";
import { Icon } from "@iconify/vue"; // 引入 Icon 组件
import ThumbUpLine from "@iconify-icons/ri/thumb-up-line"; // 引入点赞图标
import ThumbDownLine from "@iconify-icons/ri/thumb-down-line"; // 引入 dislike 图标

// 评论排序选项
const sortOptions = [
  { label: "最新发布", value: "newest" },
  { label: "最多点赞", value: "mostLiked" }
];
const currentSort = ref("newest");

// 模拟评价数据结构增加回复功能
const evaluations = ref([
  {
    id: 1,
    user: "用户A",
    avatar: "https://via.placeholder.com/40",
    content: "这门课程非常实用，老师讲解得很清晰，推荐！",
    date: "2023-10-01",
    likes: 10,
    dislikes: 2,
    rating: 5,
    replies: [
      {
        id: 101,
        user: "用户B",
        avatar: "https://via.placeholder.com/40",
        content: "同意楼主的观点！",
        date: "2023-10-02",
        likes: 3
      }
    ]
  },
  {
    id: 2,
    user: "用户B",
    avatar: "https://via.placeholder.com/40", // 头像URL
    content: "课程内容很丰富，但有些部分可以再深入一些。",
    date: "2023-10-02",
    likes: 5,
    dislikes: 1
  },
  {
    id: 3,
    user: "用户C",
    avatar: "https://via.placeholder.com/40", // 头像URL
    content: "作业量有点大，但确实能学到很多东西。",
    date: "2023-10-03",
    likes: 8,
    dislikes: 0
  },
  {
    id: 4,
    user: "用户D",
    avatar: "https://via.placeholder.com/40", // 头像URL
    content: "老师很负责任，课程安排合理，值得学习。",
    date: "2023-10-04",
    likes: 15,
    dislikes: 3
  },
  {
    id: 5,
    user: "用户E",
    avatar: "https://via.placeholder.com/40", // 头像URL
    content: "课程内容有点难，但学完后收获很大。",
    date: "2023-10-05",
    likes: 12,
    dislikes: 4
  }
  // 更多评价...
]);

// 分页相关逻辑
const pageSize = ref(5); // 每页显示的评价数量
const currentPage = ref(1); // 当前页码

// 计算当前页显示的评价
const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return evaluations.value.slice(start, end);
});

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 提交评价相关逻辑
const newEvaluation = ref(""); // 用户输入的评价内容
const newRating = ref(0); // 用户输入的评分
const isInputFocused = ref(false); // 输入框是否聚焦

const submitEvaluation = () => {
  if (newEvaluation.value.trim() === "") {
    ElMessage.warning("评价内容不能为空！");
    return;
  }

  if (newRating.value === 0) {
    ElMessage.warning("请先评分！");
    return;
  }

  // 模拟提交评价
  evaluations.value.unshift({
    id: evaluations.value.length + 1,
    user: "当前用户",
    avatar: "https://via.placeholder.com/40", // 当前用户头像
    content: newEvaluation.value,
    date: new Date().toISOString().split("T")[0],
    likes: 0,
    dislikes: 0
  });

  // 清空输入框和评分
  newEvaluation.value = "";
  newRating.value = 0;
  isInputFocused.value = false;
  ElMessage.success("评价提交成功！");
};

// 点赞和 dislike 功能
const likeEvaluation = (evaluation: any) => {
  evaluation.likes++;
};

const dislikeEvaluation = (evaluation: any) => {
  evaluation.dislikes++;
};

// 计算评价总数
const totalEvaluations = computed(() => evaluations.value.length);

// 排序后的评价列表
const sortedEvaluations = computed(() => {
  const sorted = [...evaluations.value];
  if (currentSort.value === "mostLiked") {
    return sorted.sort((a, b) => b.likes - a.likes);
  }
  return sorted.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

// 新增回复相关逻辑
const showReplyInput = ref<number | null>(null);
const replyContent = ref("");

const handleReply = (evaluationId: number) => {
  showReplyInput.value = evaluationId;
};

const submitReply = (evaluationId: number) => {
  if (!replyContent.value.trim()) {
    ElMessage.warning("回复内容不能为空！");
    return;
  }

  const evaluation = evaluations.value.find(e => e.id === evaluationId);
  if (evaluation) {
    evaluation.replies.push({
      id: Date.now(),
      user: "当前用户",
      avatar: "https://via.placeholder.com/40",
      content: replyContent.value,
      date: new Date().toISOString().split("T")[0],
      likes: 0
    });
  }

  replyContent.value = "";
  showReplyInput.value = null;
  ElMessage.success("回复成功！");
};
</script>

<template>
  <el-card
    class="p-5 w-[1180px] shadow-md rounded-lg bg-white dark:bg-gray-800"
    shadow="never"
  >
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">课程评价</h2>
    </template>

    <!-- 评价输入区域 -->
    <div class="mb-6 bg-gray-50 p-4 rounded-lg">
      <div class="flex items-start gap-4">
        <img
          class="w-10 h-10 rounded-full"
          src="https://via.placeholder.com/40"
          alt="用户头像"
        />
        <div class="flex-1">
          <el-rate
            v-model="newRating"
            class="mb-2"
            :texts="['很差', '较差', '一般', '不错', '很好']"
            show-text
          />
          <el-input
            v-model="newEvaluation"
            type="textarea"
            :rows="3"
            placeholder="说说你的想法..."
            @focus="isInputFocused = true"
          />
          <div v-if="isInputFocused" class="mt-3 flex justify-end">
            <el-button type="primary" @click="submitEvaluation"
              >发布评价</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="space-y-6">
      <div
        v-for="evaluation in sortedEvaluations"
        :key="evaluation.id"
        class="evaluation-item"
      >
        <div class="flex gap-4">
          <img
            class="w-10 h-10 rounded-full"
            :src="evaluation.avatar"
            :alt="evaluation.user"
          />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-medium text-blue-600">{{
                evaluation.user
              }}</span>
              <el-rate
                v-if="evaluation.rating"
                :model-value="evaluation.rating"
                disabled
                size="small"
              />
            </div>
            <p class="mt-2 text-gray-700">{{ evaluation.content }}</p>
            <div class="mt-2 flex items-center text-gray-500 text-sm gap-4">
              <span>{{ evaluation.date }}</span>
              <div class="flex items-center gap-4">
                <el-button type="text" @click="likeEvaluation(evaluation)">
                  <Icon :icon="ThumbUpLine" class="mr-1" />
                  {{ evaluation.likes }}
                </el-button>
                <el-button type="text" @click="dislikeEvaluation(evaluation)">
                  <Icon :icon="ThumbDownLine" class="mr-1" />
                  {{ evaluation.dislikes }}
                </el-button>
                <el-button type="text" @click="handleReply(evaluation.id)">
                  回复
                </el-button>
              </div>
            </div>

            <!-- 回复输入框 -->
            <div v-if="showReplyInput === evaluation.id" class="mt-3">
              <el-input
                v-model="replyContent"
                type="textarea"
                :rows="2"
                placeholder="写下你的回复..."
              />
              <div class="mt-2 flex justify-end gap-2">
                <el-button @click="showReplyInput = null">取消</el-button>
                <el-button type="primary" @click="submitReply(evaluation.id)"
                  >回复</el-button
                >
              </div>
            </div>

            <!-- 回复列表 -->
            <div
              v-if="evaluation.replies?.length"
              class="mt-4 bg-gray-50 p-3 rounded"
            >
              <div
                v-for="reply in evaluation.replies"
                :key="reply.id"
                class="mb-3 last:mb-0"
              >
                <div class="flex items-start gap-3">
                  <img
                    class="w-8 h-8 rounded-full"
                    :src="reply.avatar"
                    :alt="reply.user"
                  />
                  <div>
                    <span class="font-medium text-blue-600">{{
                      reply.user
                    }}</span>
                    <p class="mt-1 text-sm text-gray-700">
                      {{ reply.content }}
                    </p>
                    <div
                      class="mt-1 flex items-center text-gray-500 text-xs gap-4"
                    >
                      <span>{{ reply.date }}</span>
                      <el-button type="text" size="small">
                        <Icon :icon="ThumbUpLine" class="mr-1" />
                        {{ reply.likes }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="mt-6 flex justify-center">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="evaluations.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </el-card>
</template>

<style scoped>
.evaluation-card {
  @apply w-[1180px] shadow-md rounded-lg bg-white dark:bg-gray-800;
}

.evaluation-item {
  @apply pb-4 border-b border-gray-200 last:border-none;
}
</style>
