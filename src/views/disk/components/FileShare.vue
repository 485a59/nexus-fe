<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
    <el-form-item label="有效期" prop="expireTime">
      <el-select
        v-model="formData.expireTime"
        placeholder="请选择有效期"
        clearable
      >
        <el-option label="1天" value="1" />
        <el-option label="7天" value="7" />
        <el-option label="30天" value="30" />
        <el-option label="永久有效" value="-1" />
      </el-select>
    </el-form-item>

    <el-form-item label="分享形式">
      <el-radio-group v-model="formData.needCode">
        <el-radio :label="true">私密分享</el-radio>
        <el-radio :label="false">公开分享</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="formData.needCode" label="提取码" prop="code">
      <div class="flex items-center">
        <el-input
          v-model="formData.code"
          placeholder="请输入4位提取码"
          maxlength="4"
          class="w-[200px] mr-4"
        />
        <el-button type="primary" @click="generateCode"> 生成提取码 </el-button>
      </div>
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input v-model="formData.remark" placeholder="请输入备注" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { shareFile } from "@/api/share";

const formRef = ref();
const formData = reactive({
  expireTime: "7", // 改为 endTime
  needCode: true,
  code: "",
  remark: "", // 新增备注字段
  shareType: 1 // 新增分享类型字段，1表示私密分享，0表示公开分享
});

// 表单验证规则
const rules = reactive({
  expireTime: [{ required: true, message: "请选择有效期", trigger: "change" }],
  code: [
    {
      validator: (rule: any, value: string, callback: any) => {
        if (formData.needCode && !value) {
          callback(new Error("请输入提取码"));
        } else if (formData.needCode && value.length !== 4) {
          callback(new Error("提取码必须是4位"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"] // 添加 change 触发器
    }
  ]
});

// 生成随机提取码
const generateCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  formData.code = code;
};

// 监听needCode变化
watch(
  () => formData.needCode,
  newVal => {
    formData.shareType = newVal ? 1 : 0;
  }
);

// 获取表单数据方法
const getShareData = () => {
  const now = new Date();
  const days = parseInt(formData.expireTime);
  const endTime =
    days === -1
      ? new Date("9999-12-31")
      : new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    endTime,
    shareType: formData.shareType,
    extractCode: formData.code,
    remark: formData.remark
  };
};

// 暴露方法
defineExpose({
  formRef,
  formData,
  getShareData
});

const props = defineProps<{
  ids: string[]; // 选中的文件ID数组
}>();
</script>

<style scoped>
:deep(.el-select) {
  width: 200px;
}
</style>
