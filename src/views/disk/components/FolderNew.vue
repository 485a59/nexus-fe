<template>
  <div class="folder-new">
    <folder-tree
      :tree-data="treeData"
      @node-click="handleNodeClick"
      @new-folder="openNewFolderDialog"
    />

    <!-- 新建文件夹对话框 -->
    <el-dialog
      v-model="newFolderVisible"
      title="新建文件夹"
      width="30%"
      destroy-on-close
    >
      <div class="folder-form">
        <el-form
          ref="folderFormRef"
          :model="formInline"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="文件夹名称" prop="name">
            <el-input
              v-model="formInline.name"
              placeholder="请输入文件夹名称"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newFolderVisible = false">取消</el-button>
          <el-button type="primary" @click="handleNewFolder">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import FolderTree from "./FolderTree.vue";
import { createFolder } from "@/api/file";
import { message } from "@/utils/message";
import { useDiskStore } from "@/store/modules/disk";

const formRef = ref<FormInstance>();
const folderFormRef = ref<FormInstance>();
const newFolderVisible = ref(false);
const parentNode = ref<any>(null);

const formData = reactive({
  targetPath: ""
});

const formInline = reactive({
  name: ""
});

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "文件夹名称不能为空", trigger: "blur" },
    {
      min: 1,
      max: 50,
      message: "文件夹名称长度在 1 到 50 个字符",
      trigger: "blur"
    }
  ]
});

const diskStore = useDiskStore();
const treeData = computed(() => diskStore.folderTree);

// 获取文件夹树
onMounted(async () => {
  await diskStore.getFolders();
});

// 处理节点点击
const handleNodeClick = ({ data, path }: { data: any; path: string }) => {
  formData.targetPath = path;
};

// 打开新建文件夹对话框
const openNewFolderDialog = (node: any) => {
  parentNode.value = node;
  newFolderVisible.value = true;
};

// 处理新建文件夹
const handleNewFolder = async () => {
  if (!folderFormRef.value) return;

  await folderFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const folder = {
        name: formInline.name,
        path: formData.targetPath
      };
      const res = await createFolder(folder);
      if (res.code === 200) {
        message("创建成功", { type: "success" });
        newFolderVisible.value = false;
        formInline.name = "";
      } else {
        message("创建失败", { type: "error" });
      }
    }
  });
};

defineExpose({
  formRef,
  formData
});
</script>

<style scoped>
.folder-new {
  width: 100%;
}
</style>
