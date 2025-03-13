<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, UploadProps, UploadUserFile } from "element-plus";
import { Document, Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { usePPT } from "./utils/hook";
defineOptions({
  name: "PPTForm"
});

const { treeData } = usePPT();

const props = defineProps({
  formInline: {
    type: Object,
    default: () => ({})
  }
});

const ruleFormRef = ref<FormInstance>();
const form = ref({
  label: props.formInline?.label ?? "",
  author: props.formInline?.author ?? "",
  description: props.formInline?.description ?? "",
  file: props.formInline?.file ?? null,
  chapterId: props.formInline?.chapterId ?? ""
});

/** 表单验证规则 */
const formRules = {
  label: [{ required: true, message: "请输入课件名称", trigger: "blur" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  chapterId: [{ required: true, message: "请选择所属章节", trigger: "change" }],
  file: [{ required: true, message: "请上传课件文件", trigger: "change" }]
};

// 处理节点点击
const handleNodeClick = data => {
  form.value.chapterId = data.id;
};

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
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/pdf"
  ];
  const isValidType = validTypes.includes(file.type);
  if (!isValidType) {
    message("只能上传PPT或PDF文件!", { type: "warning" });
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
  <div class="flex">
    <!-- 左侧树形结构 -->
    <div class="mr-2 min-w-[200px]">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="{ label: 'name', children: 'children' }"
        node-key="id"
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      />
    </div>

    <!-- 右侧表单 -->
    <div class="w-[calc(100%-200px)]">
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
        class="mt-4"
      >
        <el-form-item label="课件名称" prop="label">
          <el-input
            v-model="form.label"
            placeholder="请输入课件名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" clearable />
        </el-form-item>

        <el-form-item label="课件文件" prop="file">
          <div v-if="!form.file" class="upload-wrapper">
            <el-upload
              class="upload-demo"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              :show-file-list="false"
              accept=".ppt,.pptx,.pdf"
              drag
            >
              <div class="upload-content">
                <div class="el-upload__text">
                  将文件拖到此处，或 <em>点击上传</em>
                </div>
                <div class="el-upload__tip">
                  支持 PPT、PDF 格式，且不超过 50MB
                </div>
              </div>
            </el-upload>
          </div>

          <!-- 上传后的文件显示 -->
          <div v-else class="uploaded-file">
            <div class="file-info">
              <el-icon class="file-icon"><document /></el-icon>
              <span class="file-name">{{ form.file.name }}</span>
              <span class="file-size">{{
                formatFileSize(form.file.size)
              }}</span>
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

        <el-form-item label="课件描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入课件描述"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tree) {
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  height: 100%;
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
