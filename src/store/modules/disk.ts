import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { type FileItem } from '@/views/disk/utils/types';
import { getFileList, getFileTree } from '@/api/file';
import { getRecycleList } from '@/api/recycle';
import { getShareFileList } from '@/api/share';
import { message } from '@/utils/message';

interface TreeNode {
  id: number;
  label: string;
  depth: number | null;
  state: string;
  filePath: string;
  children: TreeNode[];
}

export const useDiskStore = defineStore('disk', () => {
  const dataList = ref([]);
  const loading = ref(false);
  const viewMode = ref<"table" | "grid">("table");
  const currentPath = ref("/upload/path");
  const selectedNum = ref(0);
  const selectedItems = ref<FileItem[]>([]);
  const tableRef = ref(null);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const folderTree = ref<TreeNode[]>([]);

  // 添加回收站列表状态
  const recycleList = ref([]);
  const shareFileList = ref([]);
  const setRecycleList = (list: any[]) => {
    recycleList.value = list;
  };

  // 获取文件列表数据
  const fetchFileList = async (path: string) => {
    try {
      loading.value = true;
      
      const res = await getFileList(
        {
          type: 0,
          path: path
        },
        {
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage
        }
      );

      if (res?.code === 200 && res.data) {
        const transformedList = (res.data.list || []).map(item => ({
          id: item.id,
          name: item.fileName,
          type: item.isDir === 1 ? "文件夹" : item.extension.toUpperCase() + "文件",
          size: "",
          updatedAt: item.uploadTime,
          extension: item.extension,
          path: item.filePath || path,
          isDir: item.isDir
        }));

        dataList.value = transformedList;
        pagination.total = res.data.total || 0;
        pagination.currentPage = res.data.pageNum;
        pagination.pageSize = res.data.pageSize;
        
        return true;
      }
      return false;
    } catch (error) {
      message("获取文件列表失败", { type: "error" });
      return false;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  };

  // 获取文件夹树
  const getFolders = async () => {
    const res = await getFileTree();
    if (res.code === 200) {
      folderTree.value = res.data.children;
    }
    return folderTree.value;
  };

  // 修改清除表格选择方法
  const clearTableSelection = () => {
    if (tableRef.value) {
      // 对于 pure-table，需要调用 getTableRef() 获取内部的 el-table 实例
      const elTableRef = tableRef.value.getTableRef?.();
      if (elTableRef) {
        elTableRef.clearSelection();
      }
    }
    // 同时清空选中项
    selectedItems.value = [];
    selectedNum.value = 0;
  };

  // 更新选中项
  const updateSelection = (items: FileItem[]) => {
    selectedItems.value = items;
    selectedNum.value = items.length;
  };

  // 清空选中项
  const clearSelection = () => {
    selectedItems.value = [];
    selectedNum.value = 0;
    // 清除表格选择状态
    if (tableRef.value) {
      const elTableRef = tableRef.value.getTableRef?.();
      if (elTableRef) {
        elTableRef.clearSelection();
      }
    }
  };

  // 获取回收站列表数据
  const fetchRecycleList = async () => {
    try {
      loading.value = true;
      const res = await getRecycleList({
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });

      if (res?.code === 200 && res.data) {
        const transformedList = (res.data.list || []).map(item => ({
          id: item.id,
          name: item.fileName,
          type: item.isDir === 1 ? "文件夹" : item.extension.toUpperCase() + "文件",
          size: "",
          updatedAt: item.deleteTime || item.uploadTime,
          extension: item.extension,
          path: item.filePath,
          isDir: item.isDir,
          deleteBatchNum: item.deleteBatchNum
        }));

        recycleList.value = transformedList;
        pagination.total = res.data.total || 0;
        pagination.currentPage = res.data.pageNum;
        pagination.pageSize = res.data.pageSize;
        
        return true;
      }
      return false;
    } catch (error) {
      message("获取回收站列表失败", { type: "error" });
      return false;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  };

  // 获取分享文件列表数据
  const fetchShareFileList = async () => {
    try {
      loading.value = true;
      const res = await getShareFileList({
        page: pagination.currentPage,
        size: pagination.pageSize
      });

      if (res?.code === 200 && res.data) {
        const transformedList = (res.data.list || []).map(item => ({
          id: item.id,
          name: item.fileName,
          type: item.isDir === 1 ? "文件夹" : item.extension.toUpperCase() + "文件",
          size: item.size || "",
          updatedAt: item.shareTime || item.uploadTime,
          extension: item.extension,
          path: item.filePath,
          isDir: item.isDir,
          shareBatchNum: item.shareBatchNum,
          shareStatus: item.shareStatus,
          endTime: item.endTime,
          extractCode: item.extractionCode,
          shareType: item.shareType
        }));

        shareFileList.value = transformedList;
        pagination.total = res.data.total || 0;
        pagination.currentPage = res.data.pageNum;
        pagination.pageSize = res.data.pageSize;
        
        return true;
      }
      return false;
    } catch (error) {
      message("获取分享列表失败", { type: "error" });
      return false;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  };

  return {
    dataList,
    recycleList,
    shareFileList,
    loading,
    viewMode,
    currentPath,
    selectedNum,
    selectedItems,
    pagination,
    folderTree,
    getFolders,
    tableRef,
    clearTableSelection,
    updateSelection,
    clearSelection,
    setRecycleList,
    fetchFileList,
    fetchRecycleList,
    fetchShareFileList
  };
}); 