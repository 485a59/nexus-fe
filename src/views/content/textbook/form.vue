<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, UploadProps, UploadUserFile } from "element-plus";
import { UploadFilled, Document, Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
defineOptions({
  name: "TextbookForm"
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
  publisher: props.formInline?.publisher ?? "",
  publishDate: props.formInline?.publishDate ?? "",
  isbn: props.formInline?.isbn ?? "",
  author: props.formInline?.author ?? "",
  edition: props.formInline?.edition ?? "",
  subject: props.formInline?.subject ?? "",
  description: props.formInline?.description ?? "",
  file: null
});

/** 表单验证规则 */
const formRules = {
  name: [{ required: true, message: "请输入教材名称", trigger: "blur" }],
  publisher: [{ required: true, message: "请输入出版社", trigger: "blur" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  publishDate: [
    { required: false, message: "请选择出版日期", trigger: "change" }
  ],
  isbn: [{ required: false, message: "请输入ISBN", trigger: "blur" }],
  edition: [{ required: false, message: "请输入版次", trigger: "blur" }],
  file: [{ required: false, message: "请上传教材文件", trigger: "change" }]
};

/** 学科选项 */
const subjectOptions = [
  { label: "信息技术", value: "信息技术" },
  { label: "农业技术", value: "农业技术" },
  { label: "物联网", value: "物联网" }
];

const fileList = ref<UploadUserFile[]>([]);

// 处理文件变化
const handleFileChange = (uploadFile: UploadUserFile) => {
  form.value.file = uploadFile.raw;
};

// 处理文件删除
const handleRemoveFile = () => {
  form.value.file = null;
  ruleFormRef.value?.clearValidate("file");
};

// 上传前验证
const beforeUpload: UploadProps["beforeUpload"] = file => {
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const isValidType = validTypes.includes(file.type);
  if (!isValidType) {
    message("只能上传PDF或Word文件!", { type: "warning" });
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message("文件大小不能超过 50MB!", { type: "warning" });
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
  } else {
    return (size / 1024 / 1024).toFixed(2) + " MB";
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
    <el-form-item label="教材名称" prop="name" class="form-item">
      <el-input v-model="form.name" placeholder="请输入教材名称" clearable />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="出版社" prop="publisher" class="form-item">
          <el-input
            v-model="form.publisher"
            placeholder="请输入出版社"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="author" class="form-item">
          <el-input v-model="form.author" placeholder="请输入作者" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="出版日期" prop="publishDate" class="form-item">
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            placeholder="请选择出版日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="ISBN" prop="isbn" class="form-item">
          <el-input v-model="form.isbn" placeholder="请输入ISBN" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="版次" prop="edition">
          <el-input v-model="form.edition" placeholder="请输入版次" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="教材简介" prop="description" class="form-item">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入教材简介"
      />
    </el-form-item>

    <el-form-item label="教材文件" prop="file" class="form-item">
      <div v-if="!form.file" class="upload-wrapper">
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept=".pdf,.doc,.docx"
          drag
        >
          <div class="upload-content">
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>
            <div class="el-upload__tip">支持 PDF、Word 格式，且不超过 50MB</div>
          </div>
        </el-upload>
      </div>

      <!-- 上传后的文件显示 -->
      <div v-else class="uploaded-file">
        <div class="file-info">
          <el-icon class="file-icon"><document /></el-icon>
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
  </el-form>
</template>

<style lang="scss" scoped>
.form-item {
  width: 100%;
  margin: 0 auto 18px;

  :deep(.el-form-item__content) {
    width: calc(100% - 100px);
  }
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

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-date-picker) {
  width: 100%;
}

.el-textarea {
  width: 100%;
}
</style>
