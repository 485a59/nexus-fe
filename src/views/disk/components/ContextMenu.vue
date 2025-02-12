<template>
  <div class="context-menu bg-white dark:bg-[#1d1e1f] rounded shadow-lg">
    <div class="py-1">
      <div class="menu-item" @click="handleAction('view')">
        <el-button link type="info" :icon="useRenderIcon(View)">查看</el-button>
      </div>
      <div class="menu-item" @click="handleAction('move')">
        <el-button link type="info" :icon="useRenderIcon(Move)">移动</el-button>
      </div>
      <div class="menu-item" @click="handleAction('download')">
        <el-button link type="info" :icon="useRenderIcon(Download)"
          >下载</el-button
        >
      </div>
      <div class="menu-item" @click="handleAction('rename')">
        <el-button link type="info" :icon="useRenderIcon(EditPen)"
          >重命名</el-button
        >
      </div>
      <div class="menu-item" @click="handleAction('share')">
        <el-button link type="info" :icon="useRenderIcon(Share)"
          >分享</el-button
        >
      </div>
      <div class="menu-item" @click="handleAction('delete')">
        <el-button link type="danger" :icon="useRenderIcon(Delete)"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import View from "@iconify-icons/ri/eye-line";
import Delete from "@iconify-icons/ep/delete";
import Move from "@iconify-icons/ri/drag-move-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Share from "@iconify-icons/ri/share-line";
import Download from "@iconify-icons/ri/download-line";

// 定义action类型
type MenuAction = "view" | "delete" | "move" | "rename" | "share" | "download";

const emit = defineEmits<{
  (e: "action", action: MenuAction): void;
}>();

const handleAction = (action: MenuAction) => {
  emit("action", action);
};
</script>

<style scoped>
.context-menu {
  min-width: 120px;
  border: 1px solid #e4e7ed;
  z-index: 2000;
  border-radius: 0.5rem;
}

.menu-item {
  padding: 5px 12px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.dark .menu-item:hover {
  background-color: #2d2f33;
}
</style>
