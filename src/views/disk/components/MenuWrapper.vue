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
      <component :is="menuComponent" @action="handleContextMenuAction" />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import ContextMenu from "./ContextMenu.vue";
import RecycleMenu from "./RecycleMenu.vue";
import ShareMenu from "./ShareMenu.vue";

const props = defineProps<{
  currentItem: any;
  type?: "normal" | "recycle" | "share"; // 用于区分普通菜单和回收站菜单
}>();

const emit = defineEmits<{
  (e: "action", action: string, item: any): void;
}>();

const menuComponent = computed(() => {
  return props.type === "recycle"
    ? RecycleMenu
    : props.type === "share"
      ? ShareMenu
      : ContextMenu;
});

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
  emit("action", action, props.currentItem);
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
