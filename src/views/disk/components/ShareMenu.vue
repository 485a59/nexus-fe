<template>
  <div class="context-menu bg-white dark:bg-[#1d1e1f] rounded shadow-lg">
    <div class="py-1">
      <div class="menu-item" @click="handleAction('copy')">
        <el-button link type="primary" :icon="useRenderIcon(Copy)"
          >复制链接</el-button
        >
      </div>
      <div class="menu-item" @click="handleAction('cancel')">
        <el-button link type="danger" :icon="useRenderIcon(Delete)"
          >取消分享</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import Copy from "@iconify-icons/ep/document-copy";

// 定义action类型
type MenuAction = "copy" | "cancel";

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
