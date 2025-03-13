<template>
  <div class="h-full flex flex-col">
    <!-- 选择提示栏 -->
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

      <el-button type="primary" text class="mr-1" @click="openBatchMoveDialog">
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

      <el-button type="primary" text class="mr-1" @click="openFileShareDialog">
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

    <!-- 网格视图 - 添加滚动容器 -->
    <div class="flex-1 overflow-auto min-h-[calc(100vh-280px)]">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 p-4">
        <div
          v-for="item in dataList"
          :key="item.id"
          class="flex flex-col items-center justify-center p-2 pt-0 rounded-lg cursor-pointer transition-all hover:bg-[#F5F7FA] dark:hover:bg-[#2D2F33]"
          :class="{ 'bg-[#F5F7FA] dark:bg-[#2D2F33]': isSelected(item) }"
          @click="handleCardClick(item, $event)"
          @contextmenu.prevent="handleRightClick(item, $event)"
        >
          <div class="self-start my-0">
            <el-checkbox
              :model-value="isSelected(item)"
              @change="val => handleCheckboxChange(item, val)"
              @click.stop
            />
          </div>

          <!-- 图标 -->
          <img
            :src="getIcon(item.type, item.extension)"
            :width="56"
            :height="56"
            class="mb-2 -mt-2"
          />
          <!-- 文件名 -->
          <span class="text-sm text-center break-all">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 添加分页组件 -->
    <div class="flex justify-center mt-4">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :background="pagination.background"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 使用通用菜单包装组件 -->
    <menu-wrapper
      ref="contextMenuRef"
      :current-item="currentItem"
      type="normal"
      @action="handleContextMenuAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import { getIcon } from "@/utils/icon";
import { useFile } from "../utils/hook";
import ContextMenu from "./ContextMenu.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Position from "@iconify-icons/ep/position";
import Download from "@iconify-icons/ep/download";
import Share from "@iconify-icons/ep/share";
import Delete from "@iconify-icons/ep/delete";
import { useDiskStore } from "@/store/modules/disk";
import type { FileItem } from "../utils/types";
import { storeToRefs } from "pinia";
import MenuWrapper from "./MenuWrapper.vue";

const store = useDiskStore();
const { dataList, loading, selectedNum, pagination } = storeToRefs(store);

const {
  handleSelectionChange,
  onSelectionCancel,
  openBatchMoveDialog,
  openFileShareDialog,
  handleBatchDelete,
  handleBatchDownload,
  handleContextMenuAction,
  handleFileClick,
  handleSizeChange,
  handleCurrentChange
} = useFile();

const emit = defineEmits([
  "toggle-selection",
  "right-click",
  "delete",
  "open-dialog",
  "context-menu-action"
]);

// 判断文件是否被选中
const isSelected = (item: FileItem) => {
  return store.selectedItems.some(selected => selected.id === item.id);
};

// 记录最后选中的项目索引
const lastSelectedIndex = ref(-1);

// 处理卡片点击
const handleCardClick = (item: FileItem, event: MouseEvent) => {
  // 如果点击的是勾选框区域，不处理（让 checkbox 的 change 事件处理选择）
  if ((event.target as HTMLElement).closest(".checkbox-area")) {
    return;
  }
  // 非勾选框区域点击，不处理选中
  handleFileClick(item);
};

// 添加右键菜单相关的状态
const currentItem = ref<any>(null);
const contextMenuRef = ref();

// 处理右键点击
const handleRightClick = (item: any, event: MouseEvent) => {
  event.preventDefault();
  currentItem.value = item;
  contextMenuRef.value?.handleRightClick(event);
};

// 添加 checkbox 变化处理函数
const handleCheckboxChange = (item: FileItem, checked: CheckboxValueType) => {
  // 处理多选
  if (event?.ctrlKey || event?.metaKey) {
    const currentSelection = Boolean(checked)
      ? [...store.selectedItems, item]
      : store.selectedItems.filter(i => i.id !== item.id);
    handleSelectionChange(currentSelection);
  } else {
    // 单选
    handleSelectionChange(checked ? [item] : []);
  }
};
</script>

<style scoped>
.selected {
  background-color: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary);
}

.flex-1 {
  flex: 1;
}

/* 调整分页组件样式 */
:deep(.el-pagination) {
  margin-bottom: 16px;
  justify-content: center;
}
</style>
