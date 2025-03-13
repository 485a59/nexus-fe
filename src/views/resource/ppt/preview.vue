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
      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        class="w-full h-full border-0"
        allow="fullscreen"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Back, Download } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const pptInfo = ref<any>(null);
const loading = ref(true);
const previewUrl = ref("");

// ONLYOFFICE 服务器配置
const ONLYOFFICE_SERVER = "http://119.3.188.68:8049";

// 根据文件类型获取预览类型
const getDocumentType = (fileUrl: string) => {
  const extension = fileUrl.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "ppt":
    case "pptx":
      return "presentation";
    case "doc":
    case "docx":
      return "word";
    case "xls":
    case "xlsx":
      return "cell";
    case "pdf":
      return "pdf";
    default:
      return "presentation";
  }
};

// 构建预览URL
const buildPreviewUrl = (fileUrl: string) => {
  const documentType = getDocumentType(fileUrl);
  let appPath = "presentation";

  switch (documentType) {
    case "word":
      appPath = "word";
      break;
    case "cell":
      appPath = "cell";
      break;
    case "pdf":
      appPath = "pdf";
      break;
  }

  return (
    `${ONLYOFFICE_SERVER}/web-apps/apps/${appPath}/main/index.html?_dc=${new Date().getTime()}` +
    "&lang=zh-CN" +
    "&viewer=true" +
    "&embedded=true" +
    `&url=${encodeURIComponent(fileUrl)}`
  );
};

// 监听 pptInfo 变化
watch(
  () => route.params.ppt,
  newPPT => {
    if (newPPT) {
      pptInfo.value = newPPT;
      if (pptInfo.value?.url) {
        previewUrl.value = buildPreviewUrl(pptInfo.value.url);
        loading.value = false;
      }
    }
  },
  { immediate: true }
);

// 处理下载
const handleDownload = () => {
  if (pptInfo.value?.url) {
    window.open(pptInfo.value.url);
  } else {
    ElMessage.warning("下载地址不存在");
  }
};
</script>

<style lang="scss" scoped>
.ppt-preview {
  @apply h-screen flex flex-col;

  .preview-container {
    @apply flex-1 bg-bg_color;
    height: calc(100vh - 72px);
  }
}
</style>
