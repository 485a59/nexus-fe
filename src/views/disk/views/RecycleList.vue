<template>
  <div class="flex h-full">
    <!-- 侧边栏 -->
    <Sidebar :default-active="'recycle-bin'" />
    <!-- 内容区域 -->
    <el-card shadow="never" class="w-full ml-6">
      <div class="p-5">
        <!-- 标题和说明 -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-lg font-medium">回收站</h2>
            <el-popconfirm
              title="确定要清空回收站吗？此操作不可恢复"
              @confirm="handleClearRecycleBin"
            >
              <template #reference>
                <el-button type="danger" :icon="useRenderIcon(Delete)">
                  清空回收站
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <p class="text-sm text-gray-500">
            回收站不占用网盘空间，文件保存10天
          </p>
        </div>

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
              <el-popconfirm
                title="是否彻底删除?"
                @confirm="handleBatchRecycleDelete"
              >
                <template #reference>
                  <el-button type="danger" text class="mr-1">
                    <el-icon class="mr-1">
                      <component :is="useRenderIcon(Delete)" />
                    </el-icon>
                    彻底删除
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
              :data="recycleList"
              :columns="dynamicColumns"
              :pagination="{ ...pagination, size }"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              class="rounded-lg"
              @row-double-click="handleRowDoubleClick"
              @row-contextmenu="handleRightClick"
              @selection-change="handleSelectionChange"
            >
              <template #operation="{ row }">
                <el-dropdown trigger="click">
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(More)"
                  />
                  <template #dropdown>
                    <RecycleMenu
                      @action="action => handleContextMenuAction(action, row)"
                    />
                  </template>
                </el-dropdown>
                <el-popconfirm
                  title="是否彻底删除?"
                  @confirm="() => handleRecycleDelete(row.id)"
                >
                  <template #reference>
                    <el-button
                      class="reset-margin"
                      link
                      type="danger"
                      :size="size"
                      :icon="useRenderIcon(Delete)"
                    >
                      彻底删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>

            <!-- 使用通用菜单包装组件，指定type为recycle -->
            <menu-wrapper
              ref="contextMenuRef"
              :current-item="currentItem"
              type="recycle"
              @action="handleContextMenuAction"
            />
          </template>
        </PureTableBar>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import RecycleMenu from "../components/RecycleMenu.vue";
import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more-filled";
import { useFile } from "../utils/hook";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import { useDiskStore } from "@/store/modules/disk";
import { storeToRefs } from "pinia";
import { FileItem } from "../utils/types";
import Sidebar from "../components/Sidebar.vue";
import { message } from "@/utils/message";
import MenuWrapper from "../components/MenuWrapper.vue";

const store = useDiskStore();
const { loading, selectedNum, recycleList } = storeToRefs(store);

const {
  columns,
  pagination,
  handleSelectionChange,
  onSelectionCancel,
  handleFileClick,
  onSearch,
  loadRecycleList,
  handleBatchRecycleDelete,
  handleRecycleDelete,
  handleRestoreRecycle
} = useFile();

const dropdownRef = ref();
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

const handleContextMenuAction = (action: string, row?: any) => {
  const targetRow = row || currentItem.value;
  if (!targetRow) return;

  switch (action) {
    case "restore":
      handleRestoreRecycle(targetRow);
      break;
    case "delete":
      handleRecycleDelete(targetRow.id);
      break;
  }
};

const emit = defineEmits([
  "refresh",
  "selection-change",
  "open-dialog",
  "delete",
  "context-menu-action"
]);

const handleDelete = (row: any) => {
  emit("delete", row);
};

const openDialog = (type: string, row: any) => {
  emit("open-dialog", type, row);
};

// 添加表格高度计算
const tableHeight = window.innerHeight - 280; // 减去其他元素的高度

// 监听分页变化
watch(
  () => pagination.currentPage,
  () => {
    loadRecycleList();
  }
);

watch(
  () => pagination.pageSize,
  () => {
    loadRecycleList();
  }
);

// 修改清空回收站方法，清空后重新加载列表
const handleClearRecycleBin = async () => {
  try {
    // TODO: 调用清空回收站的 API
    message("回收站已清空", { type: "success" });
    // 刷新列表
    await loadRecycleList();
  } catch (error) {
    message("清空回收站失败", { type: "error" });
  }
};

// 组件挂载时加载回收站列表
onMounted(() => {
  loadRecycleList();
});
</script>

<style scoped>
:deep(.pure-table) {
  height: 100%;
  min-height: calc(100vh - 280px);
}
</style>
