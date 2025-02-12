<template>
  <div class="file-preview">
    <!-- 图片预览 -->
    <div v-if="previewType === 'image'" class="preview-container">
      <el-image
        :src="previewUrl"
        :preview-src-list="[previewUrl]"
        fit="contain"
        class="preview-image"
      />
    </div>

    <!-- 视频预览 -->
    <div v-else-if="previewType === 'video'" class="preview-container">
      <video controls :src="previewUrl" class="preview-video">
        您的浏览器不支持视频播放
      </video>
    </div>

    <!-- 音频预览 -->
    <div v-else-if="previewType === 'audio'" class="preview-container">
      <audio controls :src="previewUrl" class="preview-audio">
        您的浏览器不支持音频播放
      </audio>
    </div>

    <!-- Office 文件预览 -->
    <div v-else-if="previewType === 'office'" class="preview-container">
      <iframe
        :src="`https://view.xdocin.com/view?src=${encodeURIComponent(previewUrl)}`"
        class="preview-office"
        frameborder="0"
        style="height: calc(100vh - 100px)"
      />
    </div>

    <!-- PDF 预览 -->
    <div v-else-if="previewType === 'pdf'" class="preview-container">
      <iframe
        :src="previewUrl"
        class="preview-iframe"
        type="application/pdf"
      ></iframe>
    </div>

    <!-- 文本文件预览 -->
    <div v-else-if="previewType === 'text'" class="preview-container">
      <pre class="preview-text">{{ textContent }}</pre>
    </div>

    <!-- 其他文件预览 -->
    <div v-else class="preview-container">
      <div class="preview-unsupported">
        <el-icon class="text-4xl mb-4"><Warning /></el-icon>
        <p>该文件类型暂不支持预览</p>
        <el-button type="primary" @click="handleDownload">下载文件</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Warning } from "@element-plus/icons-vue";
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";

interface Props {
  previewUrl: string;
  previewType:
    | "image"
    | "video"
    | "audio"
    | "office"
    | "pdf"
    | "text"
    | "other";
  fileName: string;
  extension: string;
}

const props = defineProps<Props>();
const textContent = ref("");

// 判断具体的 Office 文件类型
const isWordFile = computed(
  () =>
    props.extension?.toLowerCase() === "docx" ||
    props.extension?.toLowerCase() === "doc"
);

const isExcelFile = computed(
  () =>
    props.extension?.toLowerCase() === "xlsx" ||
    props.extension?.toLowerCase() === "xls"
);

// 加载文本内容
onMounted(async () => {
  if (props.previewType === "text") {
    try {
      const response = await fetch(props.previewUrl);
      textContent.value = await response.text();
    } catch (error) {
      console.error("加载文本内容失败:", error);
    }
  }
});

// 处理预览成功
const handleRendered = () => {
  console.log("文件预览成功");
};

// 处理预览错误
const handleError = (error: any) => {
  console.error("文件预览失败:", error);
};

const handleDownload = () => {
  const link = document.createElement("a");
  link.href = props.previewUrl;
  link.download = props.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.file-preview {
  width: 100%;
  height: 100%;
  background: var(--el-bg-color);
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-video,
.preview-audio {
  width: 100%;
  max-height: 100%;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-text {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px;
  white-space: pre-wrap;
  font-family: monospace;
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.preview-unsupported {
  text-align: center;
  padding: 20px;
}

.preview-unsupported .el-button {
  margin-top: 16px;
}

.preview-office {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
