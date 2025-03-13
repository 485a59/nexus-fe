<template>
  <component
    :is="viewMode === 'table' ? TableView : GridView"
    :loading="loading"
    :columns="columns"
    :selected-num="selectedNum"
    :pagination="pagination"
    :selected-items="selectedItems"
    @selection-change="handleSelectionChange"
    @context-menu-action="handleContextMenuAction"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDiskStore } from "@/store/modules/disk";
import TableView from "../components/TableView.vue";
import GridView from "../components/GridView.vue";
import { useFile } from "../utils/hook";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { watch } from "vue";

const route = useRoute();
const store = useDiskStore();
const { loading, viewMode, selectedNum, selectedItems } = storeToRefs(store);

const {
  columns,
  pagination,
  handleSelectionChange,
  handleContextMenuAction,
  loadFileList
} = useFile();

// 监听路由参数变化
watch(
  () => route.query.type,
  newType => {
    // 根据类型加载对应的文件列表
    loadFileList(newType as string);
  },
  { immediate: true }
);

// 路由更新前也要处理
onBeforeRouteUpdate(to => {
  loadFileList(to.query.type as string);
});
</script>
