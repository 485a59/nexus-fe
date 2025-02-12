<template>
  <div
    class="flex items-center text-sm w-full min-h-[40px] hover:bg-gray-50 rounded px-2"
  >
    <!-- 根路径 -->
    <div
      class="flex items-center cursor-pointer hover:text-blue-500 transition-colors rounded px-2 py-1"
      @click="handlePathClick('/')"
    >
      <el-icon class="text-lg text-gray-500"><Folder /></el-icon>
      <span class="ml-1">全部文件</span>
    </div>

    <!-- 动态路径部分 -->
    <template v-for="(path, index) in pathParts" :key="index">
      <el-icon class="text-gray-400 text-xs"><ArrowRight /></el-icon>
      <el-dropdown trigger="click" @command="handleDropdownCommand">
        <span
          class="cursor-pointer px-2 py-1 rounded-sm transition-all"
          :class="[
            index === pathParts.length - 1
              ? 'text-blue-500 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ path }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="folder-dropdown-menu">
            <el-scrollbar>
              <el-tree
                :data="folderTree"
                :props="{
                  children: 'children',
                  label: 'label'
                }"
                node-key="id"
                :expand-on-click-node="false"
                highlight-current
                @node-click="handleTreeNodeClick"
              >
                <template #default="{ node }">
                  <div class="flex items-center py-1 px-2">
                    <el-icon class="mr-1"><Folder /></el-icon>
                    <span>{{ node.label }}</span>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { Folder, ArrowRight, ArrowDown } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { useFile } from "../utils/hook";
import { useDiskStore } from "@/store/modules/disk";
import { storeToRefs } from "pinia";

const store = useDiskStore();
const { currentPath, folderTree } = storeToRefs(store);
const { handlePathChange } = useFile();

// 将路径拆分为数组
const pathParts = computed(() => {
  const parts = currentPath.value.split("/").filter(part => part.trim() !== "");
  return parts.length === 0 ? [] : parts;
});

// 获取完整路径
const getFullPath = (index: number) => {
  const parts = pathParts.value.slice(0, index + 1);
  return parts.length > 0 ? "/" + parts.join("/") : "/";
};

// 对话框相关状态
const dialogVisible = ref(false);
const inputPath = ref("");

// 处理路径点击
const handlePathClick = (path: string) => {
  handlePathChange(path);
};

// 处理树节点点击
const handleTreeNodeClick = (data: any) => {
  handlePathChange(data.filePath);
};

// 处理下拉菜单命令
const handleDropdownCommand = (command: string) => {
  handlePathChange(command);
};

// 处理路径确认
const handlePathConfirm = () => {
  if (!inputPath.value) {
    message("路径不能为空", { type: "warning" });
    return;
  }

  // 确保路径以 / 开头
  let normalizedPath = inputPath.value;
  if (!normalizedPath.startsWith("/")) {
    normalizedPath = "/" + normalizedPath;
  }

  handlePathChange(normalizedPath);
  dialogVisible.value = false;
  inputPath.value = "";
};
</script>

<style scoped>
.folder-icon {
  font-size: 1.1em;
  margin-right: 2px;
}

.el-dialog__body {
  padding: 20px;
}

:deep(.el-input__prefix) {
  color: #909399;
}

:deep(.folder-dropdown-menu) {
  padding: 10px;
  min-width: 400px;
  max-height: 80vh;
  overflow: hidden;
}

:deep(.el-scrollbar) {
  max-height: calc(80vh - 20px);
}

:deep(.el-scrollbar__wrap) {
  max-height: none;
}

:deep(.el-tree) {
  background: transparent;
  width: 100%;
  padding: 4px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-dropdown-menu__item) {
  padding: 0;
  line-height: normal;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: transparent;
}

:deep(.el-tree-node__content:hover) {
  background-color: var(--el-fill-color-light);
}
</style>
