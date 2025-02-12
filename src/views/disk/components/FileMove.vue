<template>
  <div class="batch-move">
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
      <new-folder ref="newFolderRef" />
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
import { ElMessage } from "element-plus";
import FolderTree from "./FolderTree.vue";
import FolderNew from "./FolderNew.vue";
import { useDiskStore } from "@/store/modules/disk";

const formRef = ref();
const newFolderRef = ref();
const newFolderVisible = ref(false);
const parentNode = ref<any>(null);

const formData = reactive({
  targetPath: ""
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
  if (!newFolderRef.value) return;

  const { formRef, formInline } = newFolderRef.value;
  await formRef.validate(async (valid: boolean) => {
    if (valid) {
      // TODO: 调用API创建文件夹
      const newFolder = {
        id: Date.now(),
        name: formInline.name,
        children: []
      };

      if (parentNode.value) {
        if (!parentNode.value.children) {
          parentNode.value.children = [];
        }
        parentNode.value.children.push(newFolder);
      } else {
        treeData.value.push(newFolder);
      }

      ElMessage.success("创建成功");
      newFolderVisible.value = false;
    }
  });
};

defineExpose({
  formRef,
  formData
});
</script>

<style scoped></style>
