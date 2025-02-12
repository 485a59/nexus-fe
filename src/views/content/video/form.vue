<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, UploadProps, UploadUserFile } from "element-plus";
import { formRules } from "./utils/rule";
import { UploadFilled } from "@element-plus/icons-vue";

defineOptions({
  name: "VideoForm"
});

const props = defineProps({
  formInline: {
    type: Object,
    default: () => ({})
  }
});

const ruleFormRef = ref<FormInstance>();
const form = ref({
  parentId: props.formInline?.parentId ?? "",
  label: props.formInline?.label ?? "",
  lecturer: props.formInline?.lecturer ?? "",
  description: props.formInline?.description ?? "",
  poster: props.formInline?.poster ?? "",
  file: props.formInline?.file ?? null
});

/** 章节选项 */
const chapterOptions = [
  { label: "第一章 前端工程化基础", value: 1 },
  { label: "第二章 Vue3核心概念", value: 4 }
];

const fileList = ref<UploadUserFile[]>([]);
const posterList = ref<UploadUserFile[]>([]);

const handleUploadSuccess: UploadProps["onSuccess"] = response => {
  form.value.file = response.data;
  message.success("视频上传成功");
};

const handlePosterSuccess: UploadProps["onSuccess"] = response => {
  form.value.poster = response.data;
  message.success("封面上传成功");
};

const handleUploadError: UploadProps["onError"] = () => {
  message.error("上传失败");
};

const beforeVideoUpload: UploadProps["beforeUpload"] = file => {
  const isValidType = file.type.startsWith("video/");
  if (!isValidType) {
    message.error("只能上传视频文件!");
    return false;
  }
  const isLt500M = file.size / 1024 / 1024 < 500;
  if (!isLt500M) {
    message.error("文件大小不能超过 500MB!");
    return false;
  }
  return true;
};

const beforePosterUpload: UploadProps["beforeUpload"] = file => {
  const isValidType = file.type.startsWith("image/");
  if (!isValidType) {
    message.error("只能上传图片文件!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片大小不能超过 2MB!");
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

    <el-form-item label="视频名称" prop="label">
      <el-input v-model="form.label" placeholder="请输入视频名称" clearable />
    </el-form-item>

    <el-form-item label="讲师" prop="lecturer">
      <el-input
        v-model="form.lecturer"
        placeholder="请输入讲师姓名"
        clearable
      />
    </el-form-item>

    <el-form-item label="视频文件" prop="file">
      <el-upload
        class="upload-demo"
        action="/api/upload"
        :limit="1"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeVideoUpload"
        :file-list="fileList"
        accept="video/*"
        drag
      >
        <div class="upload-content">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或 <em>点击上传</em>
          </div>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传视频文件，且不超过 500MB</div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item label="视频封面" prop="poster">
      <el-upload
        class="upload-demo"
        action="/api/upload"
        :limit="1"
        :on-success="handlePosterSuccess"
        :on-error="handleUploadError"
        :before-upload="beforePosterUpload"
        :file-list="posterList"
        accept="image/*"
        drag
      >
        <div class="upload-content">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或 <em>点击上传</em>
          </div>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传图片文件，且不超过 2MB</div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item label="视频描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="4"
        placeholder="请输入视频描述"
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
