<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { FormInstance, UploadProps, UploadUserFile } from "element-plus";
import { formRules } from "./utils/rule";
import { UploadFilled, VideoPlay, Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useVideo } from "./utils/hook";
defineOptions({
  name: "VideoForm"
});

/** 章节树数据 */
const { treeData } = useVideo();

const props = defineProps({
  formInline: {
    type: Object,
    default: () => ({})
  }
});

const ruleFormRef = ref<FormInstance>();
const treeRef = ref();

const form = ref({
  label: props.formInline?.label ?? "",
  lecturer: props.formInline?.lecturer ?? "",
  description: props.formInline?.description ?? "",
  file: props.formInline?.file ?? null,
  chapterId: props.formInline?.chapterId ?? ""
});

const fileList = ref<UploadUserFile[]>([]);
const posterList = ref<UploadUserFile[]>([]);

// 处理节点点击
const handleNodeClick = data => {
  form.value.chapterId = data.id;
};

const handleUploadError: UploadProps["onError"] = () => {
  message("上传失败", { type: "error" });
};

const beforeVideoUpload: UploadProps["beforeUpload"] = file => {
  const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
  const isValidType = validTypes.includes(file.type);
  if (!isValidType) {
    message("只能上传视频文件", { type: "warning" });
    return false;
  }
  const isLt500M = file.size / 1024 / 1024 < 500;
  if (!isLt500M) {
    message("文件大小不能超过 500MB!", { type: "warning" });
    return false;
  }
  return true;
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
const handleFileChange = uploadFile => {
  form.value.file = uploadFile.raw;
};

const beforeUpload: UploadProps["beforeUpload"] = file => {
  const isValidType = [
    "application/video",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ].includes(file.type);
  if (!isValidType) {
    message("只能上传PDF或Word文件!", { type: "error" });
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message("文件大小不能超过 500MB", { type: "error" });
    return false;
  }
  return true;
};

// 处理文件删除
const handleRemoveFile = () => {
  form.value.file = null;
  // 重置表单的 file 字段验证状态
  ruleFormRef.value?.clearValidate("file");
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
        <el-form-item label="视频名称" prop="label" class="form-item">
          <el-input
            v-model="form.label"
            placeholder="请输入视频名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="讲师" prop="lecturer" class="form-item">
          <el-input
            v-model="form.lecturer"
            placeholder="请输入讲师姓名"
            clearable
          />
        </el-form-item>

        <el-form-item label="视频描述" prop="description" class="form-item">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入视频描述"
          />
        </el-form-item>

        <el-form-item label="视频文件" prop="file" class="form-item">
          <div v-if="!form.file" class="upload-wrapper">
            <el-upload
              class="upload-demo"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :before-upload="beforeVideoUpload"
              :show-file-list="false"
              accept=".mp4,.webm,.mov"
              drag
            >
              <div class="upload-content">
                <div class="el-upload__text">
                  将文件拖到此处，或 <em>点击上传</em>
                </div>
                <div class="el-upload__tip">
                  支持 MP4、WebM、MOV 格式，且不超过 500MB
                </div>
              </div>
            </el-upload>
          </div>

          <!-- 上传后的文件显示 -->
          <div v-else class="uploaded-file">
            <div class="file-info">
              <el-icon class="video-icon"><video-play /></el-icon>
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
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select .el-input__wrapper) {
  width: 100%;
}

.el-textarea {
  width: 100%;
}

.form-item {
  width: 100%;
  margin: 0 auto 18px;

  :deep(.el-form-item__content) {
    width: calc(100% - 100px); // 减去 label 的宽度
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

:deep(.el-tree) {
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  height: 100%;
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

    .video-icon {
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
