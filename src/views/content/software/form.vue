<script setup lang="ts">
import { ref } from "vue";
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadUserFile
} from "element-plus";
import { formRules } from "./utils/rule";
import { Download, Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { usePublicHooks } from "../hooks";

defineOptions({
  name: "SoftwareForm"
});

const { categoryOptions } = usePublicHooks();
const props = defineProps({
  formInline: {
    type: Object,
    default: () => ({})
  }
});

const ruleFormRef = ref<FormInstance>();
const form = ref({
  name: props.formInline?.name ?? "",
  category: props.formInline?.category ?? "",
  version: props.formInline?.version ?? "",
  platform: props.formInline?.platform ?? "",
  size: props.formInline?.size ?? "",
  status: props.formInline?.status ?? 1,
  description: props.formInline?.description ?? "",
  file: null
});

/** 平台选项 */
const platformOptions = [
  { label: "Windows", value: "Windows" },
  { label: "Mac", value: "Mac" },
  { label: "Linux", value: "Linux" },
  { label: "Web", value: "Web" },
  { label: "Android", value: "Android" }
];

// 处理文件变化
const handleFileChange = (uploadFile: UploadUserFile) => {
  form.value.file = uploadFile.raw;
  if (uploadFile.raw) {
    form.value.size = formatFileSize(uploadFile.raw.size);
  }
};

// 处理文件删除
const handleRemoveFile = () => {
  form.value.file = null;
  form.value.size = "";
  ruleFormRef.value?.clearValidate("file");
};

// 上传前验证
const beforeUpload: UploadProps["beforeUpload"] = file => {
  const validTypes = [
    "application/x-msdownload",
    "application/x-apple-diskimage",
    "application/x-debian-package",
    "application/x-rpm",
    "application/zip",
    "application/x-zip-compressed"
  ];
  const isValidType = validTypes.includes(file.type);
  if (!isValidType) {
    message("只能上传安装包文件!", { type: "warning" });
    return false;
  }
  const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
  if (!isLt2G) {
    message("文件大小不能超过 2GB!", { type: "warning" });
    return false;
  }
  return true;
};

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
  }
};

/** 获取表单实例 */
const getRef = () => {
  return {
    form,
    validate: (callback: (valid: boolean) => void) => {
      ruleFormRef.value?.validate(callback);
    }
  };
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
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="软件名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入软件名称"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="软件分类" prop="category">
          <el-select
            v-model="form.category"
            class="w-full"
            placeholder="请选择软件分类"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="版本号" prop="version">
          <el-input
            v-model="form.version"
            placeholder="请输入版本号"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="支持平台" prop="platform">
          <el-select
            v-model="form.platform"
            class="w-full"
            multiple
            placeholder="请选择支持平台"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="安装包" prop="file" class="form-item">
      <div v-if="!form.file" class="upload-wrapper">
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept=".exe,.dmg,.deb,.rpm,.zip"
          drag
        >
          <div class="upload-content">
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>
            <div class="el-upload__tip">
              支持 EXE、DMG、DEB、RPM、ZIP 格式，且不超过 2GB
            </div>
          </div>
        </el-upload>
      </div>

      <div v-else class="uploaded-file">
        <div class="file-info">
          <el-icon class="file-icon"><download /></el-icon>
          <span class="file-name">{{ form.file.name }}</span>
          <span class="file-size">{{ formatFileSize(form.file.size) }}</span>
        </div>
        <div class="file-actions">
          <el-button
            type="danger"
            link
            @click="handleRemoveFile"
            :icon="useRenderIcon(Delete)"
          >
            删除
          </el-button>
        </div>
      </div>
    </el-form-item>

    <el-form-item label="软件描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="4"
        placeholder="请输入软件描述"
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .upload-content {
    text-align: center;
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
    color: var(--el-text-color-secondary);
    font-size: 12px;
    margin-top: 8px;
  }
}

.uploaded-file {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background-color: var(--el-fill-color-lighter);

  .file-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .file-icon {
      font-size: 24px;
      color: var(--el-color-primary);
    }

    .file-name {
      flex: 1;
      font-size: 14px;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .file-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
}

.upload-wrapper {
  width: 100%;
}
</style>
