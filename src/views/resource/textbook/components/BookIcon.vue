<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

// 从文本生成颜色
const backgroundColor = computed(() => {
  const colors = [
    "#4CAF50", // 绿色
    "#2196F3", // 蓝色
    "#9C27B0", // 紫色
    "#FF9800", // 橙色
    "#E91E63", // 粉色
    "#009688" // 青色
  ];

  // 使用文本的字符码总和来选择颜色
  const sum = Array.from(props.text).reduce(
    (acc: number, char: string) => acc + char.charCodeAt(0),
    0
  );
  return colors[sum % colors.length];
});

// 获取文本的前两个字
const shortText = computed(() => {
  return props.text.slice(0, 2);
});
</script>

<template>
  <div
    class="book-icon relative w-10 h-12 flex items-center justify-center text-white text-xs font-bold"
    :style="{ backgroundColor }"
  >
    <div class="book-spine"></div>
    <div class="book-text">{{ shortText }}</div>
    <div class="book-fold"></div>
    <div class="book-shadow"></div>
  </div>
</template>

<style lang="scss" scoped>
.book-icon {
  transform: perspective(500px) rotateY(-10deg);
  border-radius: 0 0.5rem 0.5rem 0;
  transition: all 0.3s ease;

  &:hover {
    transform: perspective(500px) rotateY(-15deg) translateX(-2px);
    box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.3);
  }

  .book-spine {
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 0.5rem;
  }

  .book-fold {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    border-radius: 0.5rem;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.03),
      rgba(0, 0, 0, 0.15)
    );
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 12px 12px 0;
    border-color: transparent rgba(255, 255, 255, 0.4) transparent transparent;
    filter: drop-shadow(-1px 1px 1px rgba(0, 0, 0, 0.1));
  }

  .book-text {
    transform: scale(0.9);
    letter-spacing: 1px;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  }

  .book-shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 0.5rem;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.15) 100%
    );
  }
}
</style>
