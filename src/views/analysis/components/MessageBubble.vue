<template>
  <div
    class="group relative rounded-lg px-4 py-2"
    :class="[
      type === 'user'
        ? 'bg-[#3370ff] text-white'
        : 'bg-white dark:bg-[#434654] text-gray-700 dark:text-gray-300'
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: "user" | "ai";
}>();
</script>

<style scoped>
.message-bubble {
  position: relative;
  word-break: break-word;
  white-space: pre-wrap;
}

.message-bubble.user {
  @apply bg-[#3370FF] text-white px-4 py-3 rounded-2xl rounded-br-sm;
}

.message-bubble.user::after {
  content: "";
  position: absolute;
  right: -6px;
  bottom: 0;
  width: 12px;
  height: 12px;
  background-color: #3370ff;
  clip-path: polygon(0 0, 0% 100%, 100% 100%);
}

.message-bubble.ai {
  @apply bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm;
}

.message-bubble.ai::after {
  content: "";
  position: absolute;
  left: -6px;
  top: 0;
  width: 12px;
  height: 12px;
  background-color: #f9fafb;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.dark .message-bubble.ai::after {
  background-color: #111827;
}
</style>
