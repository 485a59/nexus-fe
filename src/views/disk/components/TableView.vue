<template>
  <PureTableBar title="" :columns="columns" @refresh="onSearch">
    <template v-slot="{ size, dynamicColumns }">
      <div
        v-if="selectedNum > 0"
        class="w-full h-[46px] mb-2 pl-4 flex items-center bg-[var(--el-fill-color-light)]"
      >
        <div class="flex-auto">
          <span
            class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
          >
            已选 {{ selectedNum }} 项
          </span>
          <el-button type="primary" text @click="onSelectionCancel">
            取消选择
          </el-button>
        </div>
        <el-button
          type="primary"
          text
          class="mr-1"
          @click="openBatchMoveDialog"
        >
          <el-icon class="mr-1">
            <component :is="useRenderIcon(Position)" />
          </el-icon>
          批量移动
        </el-button>
        <el-popconfirm title="是否确认下载?" @confirm="handleBatchDownload">
          <template #reference>
            <el-button type="primary" text class="mr-1">
              <el-icon class="mr-1">
                <component :is="useRenderIcon(Download)" />
              </el-icon>
              批量下载
            </el-button>
          </template>
        </el-popconfirm>
        <el-button
          type="primary"
          text
          class="mr-1"
          @click="openFileShareDialog"
        >
          <el-icon class="mr-1">
            <component :is="useRenderIcon(Share)" />
          </el-icon>
          批量分享
        </el-button>
        <el-popconfirm title="是否确认删除?" @confirm="handleBatchDelete">
          <template #reference>
            <el-button type="danger" text class="mr-1">
              <el-icon class="mr-1">
                <component :is="useRenderIcon(Delete)" />
              </el-icon>
              批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      <pure-table
        ref="tableRef"
        row-key="id"
        adaptive
        :adaptiveConfig="{
          offsetBottom: 32,
          heightOffset: 200
        }"
        :height="tableHeight"
        align-whole="center"
        table-layout="auto"
        :loading="loading"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        :pagination="{ ...pagination, size }"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
        class="rounded-lg"
        @row-contextmenu="handleRightClick"
        @selection-change="handleSelectionChange"
      >
        <template #operation="{ row }">
          <el-dropdown trigger="contextmenu">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(More)"
            />
            <template #dropdown>
              <ContextMenu
                @action="action => handleContextMenuAction(action, row)"
              />
            </template>
          </el-dropdown>
        </template>
      </pure-table>

      <!-- 使用通用菜单包装组件 -->
      <menu-wrapper
        ref="contextMenuRef"
        :current-item="currentItem"
        type="normal"
        @action="handleContextMenuAction"
      />
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import ContextMenu from "./ContextMenu.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more-filled";
import { useFile } from "../utils/hook";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import Position from "@iconify-icons/ep/position";
import Download from "@iconify-icons/ep/download";
import Share from "@iconify-icons/ep/share";
import { useDiskStore } from "@/store/modules/disk";
import { storeToRefs } from "pinia";
import MenuWrapper from "./MenuWrapper.vue";
import { FileItem } from "../utils/types";

const store = useDiskStore();
const { dataList, loading, viewMode, currentPath, selectedItems, selectedNum } =
  storeToRefs(store);

const {
  columns,
  pagination,
  handleSelectionChange,
  onSelectionCancel,
  openFileShareDialog,
  openBatchMoveDialog,
  handleFileClick,
  onSearch,
  handleBatchDownload,
  handleBatchDelete,
  handleContextMenuAction
} = useFile();

const currentItem = ref<any>(null);
const contextMenuRef = ref();

const tableRef = ref(null);

// 监听 tableRef 变化并更新到 store
watch(
  tableRef,
  newVal => {
    if (newVal) {
      store.tableRef = newVal;
    }
  },
  { immediate: true }
);

const lastSelectedIndex = ref(-1);

const handleRightClick = (row: any, column: any, event: MouseEvent) => {
  currentItem.value = row;
  contextMenuRef.value?.handleRightClick(event);
};

const emit = defineEmits([
  "refresh",
  "selection-change",
  "open-dialog",
  "delete",
  "context-menu-action"
]);

const openDialog = (type: string, row: any) => {
  emit("open-dialog", type, row);
};

// 添加表格高度计算
const tableHeight = window.innerHeight - 280; // 减去其他元素的高度
</script>

<style scoped>
:deep(.pure-table) {
  height: 100%;
  min-height: calc(100vh - 280px);
}
</style>
