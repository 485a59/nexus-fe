<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="80px"
  >
    <el-form-item label="名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入新名称"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface FormProps {
  formInline: {
    name: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: ""
  })
});

const ruleFormRef = ref();
const newFormInline = computed(() => props.formInline);

const formRules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
};

function getRef() {
  return {
    validate: (callback: any) => ruleFormRef.value?.validate(callback),
    formData: newFormInline
  };
}

defineExpose({ getRef });
</script>
