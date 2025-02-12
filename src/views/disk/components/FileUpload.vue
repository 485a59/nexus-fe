<template>
  <el-form
    ref="formRef"
    :model="validateForm"
    label-width="82px"
    class="upload-container"
  >
    <el-upload
      ref="uploadRef"
      v-model:file-list="validateForm.fileList"
      drag
      action="#"
      :auto-upload="false"
      :limit="1"
      :on-change="handleFileChange"
      :on-exceed="handleExceed"
      class="upload-area"
    >
      <div class="upload-content">
        <IconifyIconOffline :icon="UploadIcon" class="upload-icon" />
        <h3 class="upload-title">点击或拖拽文件到此处上传</h3>
        <p class="upload-desc">仅支持单个文件上传</p>
      </div>

      <template #tip>
        <div class="upload-tip">
          支持的文件类型：PDF、Word、Excel、PPT等办公文档
        </div>
      </template>
    </el-upload>

    <div class="action-buttons" v-if="validateForm.fileList.length > 0">
      <el-button
        type="primary"
        @click="() => handleUpload(validateForm.fileList[0].raw)"
        :loading="uploadProgress > 0 && uploadProgress < 100"
      >
        <IconifyIconOffline icon="ri:upload-cloud-2-line" class="mr-1" />
        {{ uploadProgress > 0 ? `上传中 ${uploadProgress}%` : "开始上传" }}
      </el-button>
      <el-button @click="resetForm(formRef)">
        <IconifyIconOffline icon="ri:delete-bin-line" class="mr-1" />
        清空列表
      </el-button>
    </div>

    <el-progress
      v-if="uploadProgress > 0"
      :percentage="uploadProgress"
      :status="uploadProgress === 100 ? 'success' : ''"
      class="upload-progress"
    />
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import UploadIcon from "@iconify-icons/ri/upload-2-line";
import { useFile } from "../utils/hook";

const { handleUpload, uploadProgress } = useFile();
const formRef = ref();
const uploadRef = ref();
const validateForm = reactive({
  fileList: [],
  date: ""
});

// 处理文件变化
const handleFileChange = (file, fileList) => {
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message("文件大小不能超过 10MB!", { type: "warning" });
    validateForm.fileList = [];
  }
};

// 处理超出文件数量限制
const handleExceed = () => {
  message("只能上传一个文件", { type: "warning" });
};

const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
  validateForm.fileList = [];
};
</script>

<style scoped>
.upload-container {
  @apply flex flex-col items-center justify-center min-h-[500px] w-full p-6;
}

.upload-area {
  @apply w-[500px] bg-white rounded-lg shadow-sm border border-gray-100;
}

.upload-content {
  @apply flex flex-col items-center justify-center p-8;
}

.upload-icon {
  @apply text-blue-500 text-4xl mb-4;
}

.upload-title {
  @apply text-lg font-medium text-gray-700 mb-2;
}

.upload-desc {
  @apply text-sm text-gray-500;
}

.upload-tip {
  @apply mt-2 text-sm text-gray-500 text-center;
}

.action-buttons {
  @apply flex gap-4 mt-6;
}

:deep(.el-upload-dragger) {
  @apply w-full border-2 border-dashed border-gray-200 hover:border-blue-500 transition-colors;
}

:deep(.el-upload-list) {
  @apply w-full max-h-[300px] overflow-y-auto mt-4;
}

.upload-progress {
  @apply mt-4 w-full max-w-[500px];
}
</style>
