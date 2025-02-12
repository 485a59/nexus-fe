<template>
  <div class="folder-tree">
    <!-- 文件树 -->
    <div
      class="h-[300px] overflow-auto border rounded p-2 mb-4 relative border-gray-200"
    >
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        highlight-current
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="w-full flex items-center justify-between rounded px-2">
            <span>{{ node.label }}</span>
            <el-button
              v-show="currentNode?.id === data.id"
              type="primary"
              link
              :icon="useRenderIcon(Plus)"
              @click.stop="handleNewFolder(data)"
            >
              新建文件夹
            </el-button>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 当前选择的路径 -->
    <div class="text-[var(--el-text-color-secondary)] mb-4">
      当前位置: {{ currentPath || "根目录" }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Plus from "@iconify-icons/ep/plus";
import { useDiskStore } from "@/store/modules/disk";

interface TreeNode {
  id: number;
  label: string;
  depth: number | null;
  state: string;
  filePath: string;
  children: TreeNode[];
}

const props = defineProps<{
  treeData: TreeNode[];
}>();

const emit = defineEmits<{
  (e: "node-click", data: { data: TreeNode; path: string }): void;
  (e: "new-folder", parentNode: TreeNode): void;
}>();

const diskStore = useDiskStore();
const treeRef = ref();
const currentNode = ref<TreeNode | null>(null);
const currentPath = ref("");

const defaultProps = {
  children: "children",
  label: "label"
};

// 处理节点点击
const handleNodeClick = (data: TreeNode) => {
  currentNode.value = data;
  currentPath.value = data.filePath;
  emit("node-click", { data, path: currentPath.value });
};

// 处理新建文件夹
const handleNewFolder = (node: TreeNode) => {
  emit("new-folder", node);
};

defineExpose({
  currentPath
});
</script>
