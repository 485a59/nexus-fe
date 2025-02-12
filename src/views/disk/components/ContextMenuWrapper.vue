<template>
  <teleport to="body">
    <div
      v-show="showContextMenu"
      class="fixed z-[2000]"
      :style="{
        left: menuPosition.x + 'px',
        top: menuPosition.y + 'px'
      }"
      @click.stop
    >
      <context-menu @action="handleContextMenuAction" />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ContextMenu from "./ContextMenu.vue";
import { useFile } from "../utils/hook";

const props = defineProps<{
  currentItem: any;
}>();

const { handleContextMenuAction: handleAction } = useFile();

const showContextMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

// 处理右键点击
const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY
  };
  showContextMenu.value = true;
};

// 处理右键菜单动作
const handleContextMenuAction = (action: string) => {
  handleAction(action, props.currentItem);
  showContextMenu.value = false;
};

// 点击其他地方关闭菜单
const handleClickOutside = () => {
  if (showContextMenu.value) {
    showContextMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

defineExpose({
  handleRightClick
});
</script>
