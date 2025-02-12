<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, UploadProps, UploadUserFile } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";

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
  publishDate: [{ required: false, message: "请选择出版日期", trigger: "change" }],
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
  form.value.file = uploadFile.raw; // 保存原始文件对象
  fileList.value = [uploadFile];
};

const handleUploadSuccess: UploadProps["onSuccess"] = response => {
  form.value.file = response.data;
  message("文件上传成功", { type: "success" });
};

const handleUploadError: UploadProps["onError"] = () => {
  message("文件上传失败", { type: "error" });
};

const beforeUpload: UploadProps["beforeUpload"] = file => {
  const isValidType = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
  if (!isValidType) {
    message("只能上传PDF或Word文件!", { type: "error" });
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message("文件大小不能超过 50MB!", { type: "error" });
    return false;
  }
  return true;
};

// 获取表单实例和数据
const getRef = () => ({
  form,
  validate: (callback: (valid: boolean) => void) => {
    ruleFormRef.value?.validate(callback);
  }
});

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
    <el-form-item label="教材名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入教材名称" clearable />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="form.publisher" placeholder="请输入出版社" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="出版日期" prop="publishDate">
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
        <el-form-item label="ISBN" prop="isbn">
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

    <el-form-item label="教材简介" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入教材简介"
      />
    </el-form-item>

    <el-form-item label="教材文件" prop="file">
      <el-upload
        class="upload-demo"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
        :file-list="fileList"
        accept=".pdf,.doc,.docx"
        drag
      >
        <div class="upload-content">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或 <em>点击上传</em>
          </div>
        </div>
        <template #tip>
          <div class="el-upload__tip">支持 PDF、Word 格式，且不超过 50MB</div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
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

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-date-picker) {
  width: 100%;
}
</style>
