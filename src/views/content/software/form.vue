<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { formRules } from "./utils/rule";
defineOptions({
  name: "SoftwareForm"
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
  category: props.formInline?.category ?? "",
  version: props.formInline?.version ?? "",
  platform: props.formInline?.platform ?? "",
  size: props.formInline?.size ?? "",
  status: props.formInline?.status ?? 1,
  description: props.formInline?.description ?? "",
  downloadUrl: props.formInline?.downloadUrl ?? ""
});

/** 分类选项 */
const categoryOptions = [
  { label: "开发工具", value: "开发工具" },
  { label: "数据分析", value: "数据分析" },
  { label: "数据采集", value: "数据采集" },
  { label: "可视化", value: "可视化" },
  { label: "物联网", value: "物联网" }
];

/** 平台选项 */
const platformOptions = [
  { label: "Windows", value: "Windows" },
  { label: "Mac", value: "Mac" },
  { label: "Linux", value: "Linux" },
  { label: "Web", value: "Web" },
  { label: "Android", value: "Android" }
];

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

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="软件大小" prop="size">
          <el-input
            v-model="form.size"
            placeholder="请输入软件大小"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
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
      </el-col>
    </el-row>

    <el-form-item label="下载链接" prop="downloadUrl">
      <el-input
        v-model="form.downloadUrl"
        placeholder="请输入下载链接"
        clearable
      />
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
</style>
