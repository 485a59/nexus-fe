<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="software-icon">
    {{ text.charAt(0) }}
  </div>
</template>

<style scoped>
.software-icon {
  width: 100%;
  height: 100%;
  background-color: #4b5563;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
