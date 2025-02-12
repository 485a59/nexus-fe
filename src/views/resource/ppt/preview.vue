<template>
  <div class="ppt-preview">
    <div class="header p-4 flex items-center justify-between bg-bg_color">
      <div class="flex items-center gap-2">
        <el-button @click="router.back()">
          <el-icon><Back /></el-icon>
          返回
        </el-button>
        <h2 class="text-lg font-medium">{{ pptInfo?.name }}</h2>
      </div>
      <div class="flex items-center gap-2">
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载
        </el-button>
      </div>
    </div>

    <div class="preview-container" v-loading="loading">
      <div id="pptx-container"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Back, Download } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import $ from "jquery";

const route = useRoute();
const router = useRouter();
const pptInfo = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id;
  try {
    // TODO: 替换为实际的API调用
    const response = await getPPTDetail(id);
    pptInfo.value = response.data;

    // 初始化PPT预览
    await initPPTPreview(pptInfo.value.fileUrl);
  } catch (error) {
    ElMessage.error("获取PPT信息失败");
  } finally {
    loading.value = false;
  }
});

const initPPTPreview = async (fileUrl: string) => {
  try {
    $("#pptx-container").pptxToHtml({
      pptxFileUrl: fileUrl,
      slidesScale: "100%",
      slideMode: true,
      keyBoardShortCut: true,
      mediaProcess: true,
      shortcutKeys: {
        next: [34, 39],
        prev: [33, 37],
        first: [36],
        last: [35],
        fullscreen: [70]
      },
      success: () => {
        loading.value = false;
      },
      error: (e: any) => {
        console.error("PPT预览失败:", e);
        ElMessage.error("PPT预览失败");
        loading.value = false;
      }
    });
  } catch (error) {
    console.error("初始化PPT预览失败:", error);
    ElMessage.error("初始化PPT预览失败");
    loading.value = false;
  }
};

const handleDownload = () => {
  if (pptInfo.value?.fileUrl) {
    window.open(pptInfo.value.fileUrl);
  } else {
    ElMessage.warning("下载地址不存在");
  }
};
</script>

<style lang="scss" scoped>
.ppt-preview {
  @apply h-screen flex flex-col;

  .preview-container {
    @apply flex-1 bg-bg_color overflow-auto;
    height: calc(100vh - 72px);
  }
}

:deep(#pptx-container) {
  @apply p-4;

  .slide {
    @apply mb-4 bg-white shadow-sm;
  }

  .navigate {
    @apply fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-2;
  }
}
</style>
