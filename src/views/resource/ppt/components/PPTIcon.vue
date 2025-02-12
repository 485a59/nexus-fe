<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

const backgroundColor = computed(() => {
  const colors = [
    { main: "#FF9999", accent: "#FFBDBD" }, // 浅红色
    { main: "#80DEEA", accent: "#B2EBF2" }, // 浅青色
    { main: "#81C784", accent: "#A5D6A7" }, // 浅绿色
    { main: "#FFB74D", accent: "#FFCC80" }, // 浅橙色
    { main: "#64B5F6", accent: "#90CAF9" }, // 浅蓝色
    { main: "#BA68C8", accent: "#CE93D8" } // 浅紫色
  ];

  const sum = Array.from(props.text).reduce(
    (acc: number, char: string) => acc + char.charCodeAt(0),
    0
  );
  return colors[sum % colors.length];
});

const shortText = computed(() => {
  return props.text.slice(0, 2);
});
</script>

<template>
  <div class="ppt-container">
    <div class="ppt-icon" :style="{ backgroundColor: backgroundColor.main }">
      <div class="screen-effect">
        <div class="content">
          <div class="text">{{ shortText }}</div>
        </div>
      </div>
      <div
        class="bottom-bar"
        :style="{ backgroundColor: backgroundColor.accent }"
      >
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ppt-container {
  @apply relative w-full h-full;

  .ppt-icon {
    @apply w-full h-full rounded-md flex flex-col overflow-hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;

    .screen-effect {
      @apply flex-1 flex items-center justify-center relative;
      background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0) 50%
      );

      .content {
        @apply flex flex-col items-center;

        .text {
          @apply text-gray-600 text-sm font-medium mb-0.5;
          text-shadow: none;
        }

        .type {
          @apply text-gray-500 text-[10px] font-medium tracking-wide;
        }
      }
    }

    .bottom-bar {
      @apply h-2 flex items-center justify-center gap-1;

      .dot {
        @apply w-0.5 h-0.5 rounded-full bg-gray-400/60;
      }
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

      .screen-effect {
        background: linear-gradient(
          120deg,
          rgba(255, 255, 255, 0.25) 0%,
          rgba(255, 255, 255, 0) 50%
        );
      }

      .bottom-bar .dot {
        @apply bg-gray-400/80;
      }
    }
  }
}
</style>
