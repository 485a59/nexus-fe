<script setup lang="ts">
import { ref, markRaw } from "vue";
import ReCol from "@/components/ReCol";
import { useRouter } from "vue-router";
import { useDark, randomGradient } from "./utils";
import Carousel1 from "@/assets/carousel/carousel_1.svg?component";
import Carousel2 from "@/assets/carousel/carousel_2.svg?component";
import Carousel3 from "@/assets/carousel/carousel_3.svg?component";
import Carousel4 from "@/assets/carousel/carousel_4.svg?component";
import Carousel5 from "@/assets/carousel/carousel_5.svg?component";
import Carousel6 from "@/assets/carousel/carousel_6.svg?component";
import { type OptionsType } from "@/components/ReSegmented";
import RocketIcon from "@/assets/svg/rocket.svg?component";
import {
  Document,
  Search,
  ChatDotRound,
  DataAnalysis,
  Tools,
  DataBoard,
  Crop,
  Monitor,
  Finished,
  Position,
  View,
  Star,
  School
} from "@element-plus/icons-vue";
const router = useRouter();
const features = ref([
  {
    icon: Document,
    title: "课程资料",
    description: "提供丰富的课程资料，涵盖农业信息技术各个方面。"
  },
  {
    icon: Search,
    title: "资源搜索",
    description: "便捷的资源搜索与分类，快速找到所需内容"
  },
  {
    icon: ChatDotRound,
    title: "互动社区",
    description: "互动学习社区，与同学和老师交流探讨"
  },
  {
    icon: DataAnalysis,
    title: "数据分析",
    description: "深入解析农业数据采集与分析技术"
  },
  {
    icon: Tools,
    title: "工具案例",
    description: "提供多种数据分析工具与案例"
  },
  {
    icon: DataBoard,
    title: "可视化",
    description: "支持数据可视化与报告生成"
  }
]);

// 农业动态数据
const agriNews = ref([
  {
    id: 1,
    title: "2024年农业科技发展新趋势报告发布",
    date: "2024-03-20",
    tag: "科技前沿",
    views: 1234,
    icon: DataAnalysis
  },
  {
    id: 2,
    title: "智慧农业物联网应用案例分析",
    date: "2024-03-19",
    tag: "技术应用",
    views: 890,
    icon: Monitor
  },
  {
    id: 3,
    title: "数字农业助力乡村振兴战略实施",
    date: "2024-03-18",
    tag: "政策解读",
    views: 756,
    icon: Document
  }
]);

// 推荐课程数据
const recommendedCourses = ref([
  {
    id: 1,
    title: "信息技术",
    instructor: "尚晖副教授",
    students: 1200,
    rating: 4.8,
    image: "src/assets/course1.png",
    url: "https://mooc1-1.chaoxing.com/course/229703254.html"
  },
  {
    id: 2,
    title: "智慧农业",
    instructor: "江苏高校成人教育研究会",
    students: 3154,
    rating: 4.9,
    image: "src/assets/course2.png",
    url: "https://www.icourse163.org/course/JSSZX-1463812165?from=searchPage&outVendor=zw_mooc_pcssjg_"
  },
  {
    id: 3,
    title: "大数据基础与应用",
    instructor: "计卫星教授",
    students: 5804,
    rating: 4.7,
    image: "src/assets/course3.png",
    url: "https://www.icourse163.org/course/BIT-1205834821?from=searchPage&outVendor=zw_mooc_pcssjg_"
  },
  {
    id: 4,
    title: "大数据基础与应用",
    instructor: "计卫星教授",
    students: 5804,
    rating: 4.7,
    image: "src/assets/course3.png",
    url: "https://www.icourse163.org/course/BIT-1205834821?from=searchPage&outVendor=zw_mooc_pcssjg_"
  }
]);

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();

let curWeek = ref(1); // 0上周、1本周
const optionsBasis: Array<OptionsType> = [
  {
    label: "上周"
  },
  {
    label: "本周"
  }
];

const handleStartLearning = (
  courseItem?: (typeof recommendedCourses.value)[0]
) => {
  if (courseItem) {
    window.open(courseItem.url, "_blank");
  }
};

const carouselItems = ref([
  {
    id: 1,
    title: "智慧农业教学平台",
    features: [
      "农业物联网技术与应用课程资源",
      "智能农业数据采集与分析实践",
      "农业信息化案例与项目实训"
    ],
    bgImage: "src/assets/carousel/carousel1.jpg"
  },
  {
    id: 2,
    title: "数字农业技术学习",
    features: [
      "农业大数据分析与应用",
      "智能农业设备控制与管理",
      "农业信息系统开发技术"
    ],
    bgImage: "src/assets/carousel/carousel2.jpg"
  },
  {
    id: 3,
    title: "智能农业装备技术",
    features: [
      "农业机器人与自动化技术",
      "精准农业与遥感技术应用",
      "智能温室与环境控制系统"
    ],
    bgImage: "src/assets/carousel/carousel3.jpg"
  },
  {
    id: 4,
    title: "农业信息化解决方案",
    features: [
      "农业生产信息化管理系统",
      "农产品质量溯源技术",
      "农业决策支持系统开发"
    ],
    bgImage: "src/assets/carousel/carousel4.jpg"
  },
  {
    id: 5,
    title: "数字乡村建设技术",
    features: [
      "乡村数字化转型方案",
      "农村电子商务平台开发",
      "智慧农村信息服务系统"
    ],
    bgImage: "src/assets/carousel/carousel5.jpg"
  },
  {
    id: 6,
    title: "农业物联网应用",
    features: [
      "农业传感器网络技术",
      "智能灌溉与施肥系统",
      "农业环境监测与预警"
    ],
    bgImage: "src/assets/carousel/carousel6.jpg"
  }
]);
</script>

<template>
  <!-- 移除最外层的 min-h-screen div -->
  <!-- 顶部区域：概览和轮播图 -->
  <div class="relative">
    <!-- 移除 max-w-7xl 限制，让轮播图占满宽度 -->
    <div class="w-full">
      <el-carousel height="500px" class="banner-carousel">
        <el-carousel-item v-for="item in carouselItems" :key="item.id">
          <div
            class="carousel-content h-full relative"
            :style="{
              backgroundImage: `url(${item.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          >
            <div
              class="absolute inset-0"
              :class="
                isDark ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-50'
              "
            ></div>

            <!-- 内容区域使用 max-w-7xl 控制宽度 -->
            <div
              class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10"
            >
              <!-- 左侧内容 -->
              <div class="w-1/2 pr-12 pl-6">
                <h2
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                  class="text-4xl font-extrabold mb-6"
                >
                  {{ item.title }}
                </h2>
                <ul class="space-y-4">
                  <li
                    v-for="(feature, index) in item.features"
                    :key="index"
                    :class="isDark ? 'text-white' : 'text-gray-800'"
                    class="flex items-center text-lg"
                  >
                    <el-icon class="mr-2"
                      ><Position class="text-blue-500 font-bold"
                    /></el-icon>
                    {{ feature }}
                  </li>
                </ul>
                <div class="mt-8 flex space-x-4">
                  <el-button
                    type="primary"
                    size="large"
                    @click="handleStartLearning"
                  >
                    立即学习
                  </el-button>
                  <el-button size="large"> 课程体系 </el-button>
                </div>
              </div>

              <!-- 右侧SVG组件 -->
              <div class="w-1/2 flex items-center justify-center">
                <component
                  :is="
                    [
                      Carousel1,
                      Carousel2,
                      Carousel3,
                      Carousel4,
                      Carousel5,
                      Carousel6
                    ][item.id - 1]
                  "
                  class="w-4/5 h-auto animate-float"
                />
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

  <!-- 其他区域使用 max-w-7xl 控制宽度 -->
  <div class="max-w-7xl mx-auto">
    <!-- 农业动态 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center whitespace-nowrap">
              <Monitor class="h-8 mr-2 text-blue-500 dark:text-blue-400" />

              <span class="text-xl font-bold text-gray-900 dark:text-white"
                >农业动态</span
              >
            </div>
            <el-button text>查看更多</el-button>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="news in agriNews"
            :key="news.id"
            class="group relative bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="absolute top-0 right-0 mt-4 mr-4">
              <el-tag
                size="small"
                :type="
                  news.tag === '科技前沿'
                    ? 'success'
                    : news.tag === '技术应用'
                      ? 'warning'
                      : 'info'
                "
                class="opacity-90"
              >
                {{ news.tag }}
              </el-tag>
            </div>

            <div class="mt-2">
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-3 line-clamp-2 pr-20"
              >
                {{ news.title }}
              </h3>
              <div
                class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{{ news.date }}</span>
                <div class="flex items-center">
                  <el-icon class="mr-1"><View /></el-icon>
                  <span>{{ news.views }} 次阅读</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 推荐课程 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center whitespace-nowrap">
              <Crop class="h-8 mr-2 text-blue-500 dark:text-blue-400" />
              <span class="text-xl font-bold text-gray-900 dark:text-white"
                >推荐课程</span
              >
            </div>
            <el-button text>全部课程</el-button>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="course in recommendedCourses"
            :key="course.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div class="aspect-w-16 aspect-h-9">
              <img
                :src="course.image"
                alt=""
                class="object-cover w-full h-full"
              />
            </div>
            <div class="p-4">
              <h3
                class="text-base font-medium text-gray-700 dark:text-white mb-2"
              >
                {{ course.title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                讲师：{{ course.instructor }}
              </p>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <el-rate
                    v-model="course.rating"
                    disabled
                    text-color="#ff9900"
                  />
                  <span class="ml-2 text-sm text-gray-500">{{
                    course.rating
                  }}</span>
                </div>
                <span class="text-sm text-gray-500"
                  >{{ course.students }} 名学员</span
                >
              </div>
              <el-button
                type="primary"
                class="w-full mt-3"
                @click="handleStartLearning(course)"
              >
                开始学习
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 平台特色 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="flex items-center justify-start whitespace-nowrap">
            <Star class="h-8 mr-2 text-blue-500 dark:text-blue-400" />
            <span class="text-xl font-bold text-gray-900 dark:text-white"
              >平台特色</span
            >
          </div>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <component
              :is="feature.icon"
              class="mx-auto mb-4 text-blue-500 dark:text-blue-400 h-[36px]"
            />
            <h3
              class="text-lg font-medium text-gray-900 dark:text-white mb-2 whitespace-nowrap"
            >
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 合作高校 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="flex items-center justify-start whitespace-nowrap">
            <School class="h-8 mr-2 text-blue-500 dark:text-blue-400" />
            <span class="text-xl font-bold text-gray-900 dark:text-white"
              >合作高校</span
            >
          </div>
        </template>

        <div class="flex items-center justify-center gap-4">
          <img
            src="@/assets/nwafu-logo.png"
            alt="西北农林科技大学"
            class="h-12"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-carousel) {
  /* 确保轮播图内容填充整个高度 */
  .el-carousel__container {
    height: 100%;
  }

  /* 确保轮播图项填充整个高度 */
  .el-carousel__item {
    height: 100%;
  }
}

:deep(.el-card) {
  --el-card-border-color: none;

  /* 解决概率进度条宽度 */
  .el-progress--line {
    width: 85%;
  }

  /* 解决概率进度条字体大小 */
  .el-progress-bar__innerText {
    font-size: 15px;
  }

  /* 隐藏 el-scrollbar 滚动条 */
  .el-scrollbar__bar {
    display: none;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

.main-content {
  margin: 20px 20px 0 !important;
}

.carousel-card {
  border: none;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

/* 丝带效果 */
.ribbon {
  position: absolute;
  top: 0;
  right: 0;
  width: 12rem;
  height: 12rem;
  background-color: #3b82f6;
  transform: rotate(45deg) translateX(6rem) translateY(-6rem);
}

/* 折射效果色块动画 */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delay {
  animation: float 4s ease-in-out infinite 2s;
}

.el-rate {
  --el-rate-void-color: #c0c4cc;
}

// 添加渐变动画
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradientFlow 15s ease infinite;
}

// 卡片悬停效果
.hover\:shadow-lg {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
}

.banner-carousel {
  width: 100vw;

  :deep(.el-carousel__container) {
    height: 500px;
  }

  :deep(.el-carousel__item) {
    overflow: hidden;
  }
}

.carousel-content {
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.4)
    );
    pointer-events: none;

    .dark & {
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0.3)
      );
    }
  }
}

// 轮播图指示器样式优化
:deep(.el-carousel__indicator) {
  .el-carousel__button {
    width: 30px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }

  &.is-active {
    .el-carousel__button {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}

// 深色模式下的指示器样式
.dark {
  :deep(.el-carousel__indicator) {
    .el-carousel__button {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &.is-active {
      .el-carousel__button {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

// 轮播图切换动画优化
:deep(.el-carousel__item) {
  &.is-animating {
    transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}

.box-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  :deep(.el-card__header) {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

// 统一深色模式样式
.dark {
  :deep(.el-card) {
    --el-card-bg-color: var(--el-bg-color-overlay);
    border-color: var(--el-border-color-darker);
    background-color: #1a1a1a; // 统一深色背景

    &.is-always-shadow {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    }
  }

  .carousel-content {
    background: linear-gradient(to right, #1a1a1a, #2a2a2a); // 统一深色渐变
  }
}

// 统一图标大小和对齐方式
.el-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 确保标题不换行
.whitespace-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 卡片样式优化
.box-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  :deep(.el-card__header) {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

// 统一图标容器大小
.icon-container {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 农业图案背景
.agriculture-pattern {
  position: absolute;
  inset: 0;
  background-image: url("@/assets/agriculture-pattern.png");
  background-size: 200px;
  opacity: 0.03;
  animation: patternFloat 20s linear infinite;
}

@keyframes patternFloat {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(5deg);
  }
}

// 新闻卡片样式
.group {
  &:hover {
    .agriculture-icon {
      transform: rotate(0) scale(1.1);
    }
  }
}

// 轮播图动画
@keyframes pulse {
  0%,
  100% {
    opacity: 0.05;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}

// 更新农业动态卡片的深色模式样式
.dark {
  .group {
    &:hover {
      background-color: rgba(31, 41, 55, 0.8);
    }
  }
}

// 修改宽度类
.w-2\/10 {
  width: 20%;
}

.w-8\/10 {
  width: 80%;
}
</style>
