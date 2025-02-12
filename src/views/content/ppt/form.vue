<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, UploadProps, UploadUserFile } from "element-plus";
import { formRules } from "./utils/rule";
import { UploadFilled } from "@element-plus/icons-vue";

defineOptions({
  name: "PPTForm"
});

const props = defineProps({
  formInline: {
    type: Object,
    default: () => ({})
  }
});

const ruleFormRef = ref<FormInstance>();
const form = ref({
  name: props.formInline?.name ?? "",
  parentId: props.formInline?.parentId ?? "",
  status: props.formInline?.status ?? 1,
  description: props.formInline?.description ?? "",
  file: props.formInline?.file ?? null
});

/** 章节选项 - 从mockData中获取 */
const chapterOptions = [
  { label: "第一章 农业物联网概述", value: 1 },
  { label: "第二章 数据采集技术", value: 2 }
];

const fileList = ref<UploadUserFile[]>([]);

const handleUploadSuccess: UploadProps["onSuccess"] = response => {
  form.value.file = response.data;
  message.success("文件上传成功");
};

const handleUploadError: UploadProps["onError"] = () => {
  message.error("文件上传失败");
};

const beforeUpload: UploadProps["beforeUpload"] = file => {
  const isValidType =
    file.type === "application/vnd.ms-powerpoint" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.type === "application/pdf";
  if (!isValidType) {
    message.error("只能上传PPT或PDF文件!");
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error("文件大小不能超过 50MB!");
    return false;
  }
  return true;
};

/** 获取表单实例 */
const getRef = () => {
  return ruleFormRef.value;
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    :rules="formRules"
    label-width="100px"
    class="mt-4"
  >
    <el-form-item label="所属章节" prop="parentId">
      <el-select
        v-model="form.parentId"
        class="w-full"
        placeholder="请选择所属章节"
      >
        <el-option
          v-for="item in chapterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="课件名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入课件名称" clearable />
    </el-form-item>

    <el-form-item label="课件文件" prop="file">
      <el-upload
        class="upload-demo"
        action="/api/upload"
        :limit="1"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        :file-list="fileList"
        accept=".ppt,.pptx,.pdf"
        drag
      >
        <div class="upload-content">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或 <em>点击上传</em>
          </div>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传 PPT/PDF 文件，且不超过 50MB</div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item label="发布状态" prop="status">
      <el-switch
        v-model="form.status"
        :active-value="1"
        :inactive-value="0"
        active-text="已发布"
        inactive-text="未发布"
        inline-prompt
      />
    </el-form-item>

    <el-form-item label="课件描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="4"
        placeholder="请输入课件描述"
      />
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-select .el-input__wrapper) {
  width: 100%;
}

.el-textarea {
  width: 100%;
}

.upload-demo {
  :deep(.el-upload) {
    width: 100%;

    .el-upload-dragger {
      width: 100%;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  :deep(.el-upload-list) {
    width: 100%;
  }

  .upload-content {
    text-align: center;
  }

  .el-icon--upload {
    font-size: 42px;
    color: var(--el-text-color-secondary);
  }

  .el-upload__text {
    color: var(--el-text-color-regular);
    margin: 8px 0;
    font-size: 13px;
    em {
      color: var(--el-color-primary);
      font-style: normal;
    }
  }

  .el-upload__tip {
    text-align: center;
  }
}
</style>
