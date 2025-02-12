<template>
  <div
    class="count-stats w-full h-full p-5 rounded-lg shadow-md bg-white dark:bg-gray-800"
  >
    <!-- 标题和时间选择框 -->
    <div class="flex justify-end mb-4 space-x-2">
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="timeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="w-64"
      />
      <!-- 筛选按钮 -->
      <el-button type="primary" @click="handleTimeRangeChange">
        筛选
      </el-button>
    </div>

    <!-- 折线图 -->
    <div
      ref="chart"
      class="chart-container w-full h-96 flex justify-center items-center"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import * as echarts from "echarts";

// 模拟数据（按时间统计）
const mockData = [
  { date: "2023-10-01", count: 10 },
  { date: "2023-10-02", count: 20 },
  { date: "2023-10-03", count: 15 },
  { date: "2023-10-04", count: 30 },
  { date: "2023-10-05", count: 25 },
  { date: "2023-10-06", count: 40 },
  { date: "2023-10-07", count: 35 },
  { date: "2023-10-08", count: 50 },
  { date: "2023-10-09", count: 45 },
  { date: "2023-10-10", count: 60 }
];

// 时间范围
const timeRange = ref<[Date, Date]>([
  new Date("2023-10-01"),
  new Date("2023-10-10")
]);

// 过滤后的数据
const filteredData = ref(mockData);

// 处理时间范围变化
const handleTimeRangeChange = () => {
  const [start, end] = timeRange.value;
  filteredData.value = mockData.filter(
    item => new Date(item.date) >= start && new Date(item.date) <= end
  );
  updateChart();
};

// 图表实例
const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (chart.value) {
    myChart = echarts.init(chart.value);
    // 手动设置图表的宽度和高度
    myChart.resize({
      width: chart.value.clientWidth || 1180,
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
        trigger: "axis",
        formatter: (params: any) => {
          const data = params[0];
          return `日期: ${data.name}<br/>观看次数: ${data.value}`;
        }
      },
      xAxis: {
        type: "category",
        data: filteredData.value.map(item => item.date),
        axisLabel: {
          rotate: 45 // 日期倾斜显示
        }
      },
      yAxis: {
        type: "value",
        name: "观看次数"
      },
      series: [
        {
          name: "观看次数",
          type: "line",
          data: filteredData.value.map(item => item.count),
          smooth: true, // 平滑曲线
          lineStyle: {
            color: "#409EFF" // 线条颜色
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(64, 158, 255, 0.6)" // 渐变起始颜色
                },
                {
                  offset: 1,
                  color: "rgba(64, 158, 255, 0)" // 渐变结束颜色
                }
              ]
            }
          }
        }
      ],
      grid: {
        left: "10%",
        right: "10%",
        bottom: "20%",
        containLabel: true
      }
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
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
