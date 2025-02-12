<template>
  <div class="flex h-full">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 内容区域 -->
    <el-card shadow="never" class="w-full ml-6">
      <div class="p-5">
        <!-- 操作按钮 -->
        <div class="flex items-center gap-2.5 mb-5">
          <el-button
            type="primary"
            :icon="useRenderIcon(Upload)"
            @click="openUploadDialog"
          >
            上传文件
          </el-button>
          <el-button
            :icon="useRenderIcon(FolderAdd)"
            @click="openNewFolderDialog"
          >
            新建文件夹
          </el-button>
          <el-dropdown class="ml-2" @command="handleCreateDocument">
            <el-button type="primary" :icon="useRenderIcon(CreateDocument)">
              新建文件
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="markdown">
                  <span class="inline-flex items-center">
                    <component :is="useRenderIcon(NoteIcon)" />
                    新建笔记
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="code">
                  <span class="inline-flex items-center">
                    <component :is="useRenderIcon(CodeIcon)" />
                    新建代码
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 搜索框 -->
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文件名"
            class="!w-[200px] ml-auto mr-2"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleClear"
          >
            <template #prefix>
              <el-icon class="text-gray-400">
                <Search />
              </el-icon>
            </template>
          </el-input>

          <el-button-group>
            <el-button
              style="
                border-top-right-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
              "
              :type="viewMode === 'table' ? 'primary' : 'default'"
              :icon="useRenderIcon(List)"
              @click="toggleViewMode('table')"
            />
            <el-button
              style="
                border-top-left-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
              "
              :type="viewMode === 'grid' ? 'primary' : 'default'"
              :icon="useRenderIcon(Grid)"
              @click="toggleViewMode('grid')"
            />
          </el-button-group>
        </div>

        <!-- 当前位置 -->
        <Breadcrumb
          :current-path="currentPath"
          @path-change="handlePathChange"
          class="mb-5"
        />

        <!-- 文件列表视图 -->
        <component
          :is="viewMode === 'table' ? TableView : GridView"
          :loading="loading"
          :columns="columns"
          :selected-num="selectedNum"
          :pagination="pagination"
          :selected-items="selectedItems"
          @toggle-selection="toggleSelection"
          @right-click="handleRightClick"
          @selection-change="handleSelectionChange"
          @open-dialog="openDialog"
          @delete="handleDelete"
          @context-menu-action="handleContextMenuAction"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Sidebar from "./components/Sidebar.vue";
import TableView from "./components/TableView.vue";
import GridView from "./components/GridView.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import Upload from "@iconify-icons/ri/upload-line";
import FolderAdd from "@iconify-icons/ri/folder-add-line";
import DocumentAdd from "@iconify-icons/ri/file-add-line";
import Grid from "@iconify-icons/ep/grid";
import List from "@iconify-icons/ep/list";
import { useFile } from "./utils/hook";
import { Search } from "@element-plus/icons-vue";
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";
import { DocumentAdd as ElPlusDocumentAdd } from "@element-plus/icons-vue";
import { ArrowDown, Document } from "@element-plus/icons-vue";
import NoteIcon from "@iconify-icons/ri/file-text-line"; // 笔记图标
import CodeIcon from "@iconify-icons/ri/code-line"; // 代码图标
import CreateDocument from "@iconify-icons/ri/file-add-line";
import { useDiskStore } from "@/store/modules/disk";
import { storeToRefs } from "pinia";

defineOptions({
  name: "Disk"
});

const router = useRouter();

const store = useDiskStore();
const { dataList, loading, viewMode, currentPath, selectedNum, selectedItems } =
  storeToRefs(store);

const {
  columns,
  pagination,
  handlePathChange,
  handleSelectionChange,
  openUploadDialog,
  openNewFolderDialog,
  toggleViewMode,
  handleContextMenuAction,
  onSelectionCancel
} = useFile();

// 搜索相关
const searchKeyword = ref("");

const toggleSelection = (item: any) => {
  // 处理选中逻辑
};

// 处理搜索
const handleSearch = () => {
  console.log("搜索关键字:", searchKeyword.value);
  // TODO: 实现搜索逻辑
};

// 处理清空搜索
const handleClear = () => {
  searchKeyword.value = "";
  // TODO: 重置搜索结果
};

// 在 script setup 中添加处理函数
const handleCreateDocument = (type: string) => {
  console.log("创建文档", type);
  switch (type) {
    case "markdown":
      router.push({ name: "Markdown" });
      break;
    case "code":
      router.push({ name: "CodeMirror" });
      console.log("创建代码文件");
      break;
  }
};
</script>

<style scoped>
:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input__prefix) {
  color: #909399;
}

:deep(.el-dropdown-menu__item span) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .icon) {
  margin-right: 4px;
  font-size: 16px;
}
</style>
