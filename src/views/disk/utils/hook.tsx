import { ref, reactive, h, onMounted, nextTick } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { getIcon } from "@/utils/icon";
import FileUpload from "../components/FileUpload.vue";
import FolderNew from "../components/FolderNew.vue";
import FileMove from "../components/FileMove.vue";
import FileShare from "../components/FileShare.vue";
import FileRename from "../components/FileRename.vue";
import FilePreview from "../components/FilePreview.vue";
import { type FileItem } from "../utils/types";
import { getFileTree, getFileList, deleteFile, renameFile, deleteFiles } from "@/api/file";
import { uploadFile, downloadFile, downloadFiles, previewFile } from "@/api/transfer";
import { useDiskStore } from '@/store/modules/disk';
import { deleteRecycle, deleteRecycles, getRecycleList, restoreRecycle } from "@/api/recycle";
import { shareFile } from "@/api/share";


export function useFile() {
  const diskStore = useDiskStore();
  
  // 使用 store 中的状态，但不解构它们
  const form = reactive({
    name: "",
    type: ""
  });

  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "文件名",
      prop: "name",
      minWidth: 500,
      fixed: "left",
      cellRenderer: ({ row }) => {
        return (
          <div 
            class="flex items-center gap-2 cursor-pointer hover:text-blue-500"
            onClick={() => handleFileClick(row)}
          >
            <img
              src={getIcon(row.type, row.extension)}
              width="32"
              height="32"
              class="mr-5"
            />
            <span class="text-ellipsis overflow-hidden whitespace-nowrap">{row.name}</span>
          </div>
        );
      }
    },
    {
      label: "大小",
      prop: "size",
      minWidth: 120,
      formatter: ({ size }) => (size ? size : "-") // 如果 size 为空，显示 "-"
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 120,
      formatter: ({ type }) => (type != "" ? type : "-")
    },
    {
      label: "修改时间",
      prop: "updatedAt",
      minWidth: 120,
      formatter: ({ updatedAt }) =>
        dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss")
    }
  ];

  const uploadProgress = ref(0);

  // 切换视图模式
  const toggleViewMode = (mode: "table" | "grid") => {
    diskStore.viewMode = mode;
  };

  const handleSizeChange = (size: number) => {
    diskStore.pagination.pageSize = size;
    diskStore.pagination.currentPage = 1;
    diskStore.fetchFileList(diskStore.currentPath);
  };

  const handleCurrentChange = (page: number) => {
    diskStore.pagination.currentPage = page;
    diskStore.fetchFileList(diskStore.currentPath);
  };
  

  // 上传文件
  const handleUpload = async (file: File) => {
    if (!file) {
      message("请先选择要上传的文件", { type: "warning" });
      return;
    }
    
    try {
      uploadProgress.value = 0;
      await uploadFile(file, diskStore.currentPath, (progress) => {
        uploadProgress.value = progress;
      });
      
      message("上传成功", { type: "success" });
      uploadProgress.value = 100;
    } catch (error) {
      message("上传失败", { type: "error" });
    }
  };

  // 新建文件夹
  function handleNewFolder() {
    message("新建文件夹功能待实现", { type: "info" });
  }

  // 新建在线文档
  function handleNewDocument() {
    message("新建在线文档功能待实现", { type: "info" });
  }

  // 打开上传对话框
  function openUploadDialog() {
    addDialog({
      title: "上传文件", // 弹窗标题
      width: "40%",
      contentRenderer: () => h(FileUpload, { ref: null, formInline: null }),
      footerRenderer: () => null,
      beforeSure: done => {
        // 在这里可以获取上传的文件列表或其他逻辑
        function chores() {
          message(`上传成功`, {
            type: "success"
          });
          done(); // 关闭弹框
        }
        chores();
      }
    });
  }

  function openFileShareDialog(currentItem: any) {
    const formRef = ref();
    
    addDialog({
      title: "分享文件",
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(FileShare, { 
        ref: formRef,
        ids: Array.isArray(currentItem) ? currentItem.map(item => item.id) : [currentItem.id]
      }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value;
        if (!FormRef) return;
        
        await FormRef.formRef.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const shareData = FormRef.getShareData();
              const res = await shareFile({
                ids: Array.isArray(currentItem) ? currentItem.map(item => item.id) : [currentItem.id],
                endTime: shareData.endTime,
                shareType: shareData.shareType,
                extractionCode: shareData.extractCode,
                remark: shareData.remark
              });
              
              if (res?.code === 200) {
                message("分享成功", { type: "success" });
                done();
              } else {
                message("分享失败", { type: "error" });
              }
            } catch (error) {
              message("分享失败", { type: "error" });
            }
          }
        });
      }
    });
  }

  function openBatchMoveDialog() {
    addDialog({
      title: "上传文件", // 弹窗标题
      width: "40%",
      contentRenderer: () => h(FileMove, { ref: null, formInline: null }),
      beforeSure: done => {
        // 在这里可以获取上传的文件列表或其他逻辑
        function chores() {
          message(`上传成功`, {
            type: "success"
          });
          done(); // 关闭弹框
        }

        chores();
      }
    });
  }

  function openNewFolderDialog() {
    const formRef = ref(); // 表单引用

    addDialog({
      title: "新建文件夹", // 弹窗标题
      width: "40%", // 弹窗宽度
      contentRenderer: () =>
        h(FolderNew, {
          ref: formRef, // 传递表单引用
          formInline: null // 传递表单数据（如果需要）
        }),
      beforeSure: done => {
        const FormRef = formRef.value; // 获取表单引用

        // 表单验证
        FormRef.validate(valid => {
          if (valid) {
            const folderName = FormRef.formInline.name; // 获取文件夹名称
            console.log("创建文件夹：", folderName);

            // 在这里可以调用创建文件夹的接口
            function createFolder() {
              message(`文件夹 "${folderName}" 创建成功`, {
                type: "success"
              });
              done(); // 关闭弹窗
            }

            createFolder();
          } else {
            message("请填写完整的文件夹名称", { type: "warning" });
          }
        });
      }
    });
  }

  // 修改选择变化处理函数
  function handleSelectionChange(selection: FileItem[]) {
    // 使用 store 的 action 来更新选中状态
    diskStore.updateSelection(selection);
  }

  // 修改取消选择函数
  function onSelectionCancel() {
    // 使用 store 的 action 来清空选择
    diskStore.clearSelection();
    
    // 清除表格选择
    if (diskStore.tableRef?.clearSelection) {
      diskStore.tableRef.clearSelection();
    }
  }

  const dropdownRef = ref(null);


  // 获取文件树数据
  const fetchFileTree = async () => {
    try {
      const res = await getFileTree();
      if (res?.code === 200) {
        // 更新 store 中的 folderTree
        diskStore.folderTree = res.data.children || [];
        return res.data;
      }
    } catch (error) {
      message("获取文件树失败", { type: "error" });
    }
  };

  onMounted(async () => {
    await diskStore.getFolders(); // 使用 store 中的方法获取文件夹树
    diskStore.fetchFileList(diskStore.currentPath);
    diskStore.fetchRecycleList();
    diskStore.fetchShareFileList();
  });

  // 处理页码变化
  const handlePageChange = (page: number) => {
    diskStore.pagination.currentPage = page;
    diskStore.fetchFileList(diskStore.currentPath);
  };

  // 处理文件/文件夹点击
  const handleFileClick = (row: FileItem) => {
    if (row.isDir === 1) {
      const newPath = diskStore.currentPath + "/" + row.name;
      diskStore.currentPath = newPath;
      diskStore.pagination.currentPage = 1;
      diskStore.fetchFileList(newPath);
    } else {
      handlePreview(row);
    }
  };

  // 添加返回上级目录功能
  const handleBackToParent = (
  ) => {
    if (diskStore.currentPath === "/") {
      message("已经是根目录", { type: "warning" });
      return;
    }
    
    // 获取父级路径
    const parentPath = diskStore.currentPath.substring(0, diskStore.currentPath.lastIndexOf("/"));
    diskStore.currentPath = parentPath || "/";
    diskStore.pagination.currentPage = 1;
    diskStore.fetchFileList(diskStore.currentPath);
  };

  // 处理路径变化
  const handlePathChange = async (path: string) => {
    try {
      diskStore.currentPath = path;
      diskStore.pagination.currentPage = 1;
      const success = await diskStore.fetchFileList(path);
      
      if (!success) {
        message("获取文件列表失败，请重试", { type: "error" });
      } 
    } catch (error) {
      message("路径切换失败", { type: "error" });
    }
  };

  const onSearch = () => {
    diskStore.fetchFileList(diskStore.currentPath);
  };

  // 处理右键菜单动作
  const handleContextMenuAction = (action: string, currentItem: any) => {
    if (!currentItem) return;
    switch (action) {
      case "view":
        handlePreview(currentItem);
        console.log("查看", currentItem);
        break;
      case "delete":
        // 处理删除
        handleDelete(currentItem);
        break;
      case "rename":
        // 处理重命名
        handleRename(currentItem);
        console.log("重命名", currentItem);
        break;
      case "move":
        // 处理移动
        console.log("移动", currentItem);
        break;
      case "share":
        // 处理分享
        openFileShareDialog(currentItem);
        console.log("分享", currentItem);
        break;
      case "download":
        handleDownload(currentItem);
        break;
      case "preview":
        handlePreview(currentItem);
        break;
    }
  };

  const handleDownload = async (currentItem: any) => {
    try {
      await downloadFile(
        currentItem.id,
        currentItem.name,
        currentItem.extension, // 传递文件扩展名
        (progress) => {
          console.log(`下载进度: ${progress}%`);
        }
      );
      message("下载成功", { type: "success" });
    } catch (error) {
      message("下载失败", { type: "error" });
    }
  };

  const openPreviewDialog = (url: string, type: string, fileName: string, extension: string) => {
    addDialog({
      title: fileName,
      width: "80%",
      draggable: true,
      closeOnClickModal: false,
      footerRenderer: () => null,
      contentRenderer: () => h(FilePreview, {
        previewUrl: url,
        previewType: type as "image" | "video" | "audio" | "office" | "other",
        fileName: fileName,
        extension: extension  // 添加 extension 属性
      })
    });
  };

  const handlePreview = async (currentItem: any) => {
    try {
      const result = await previewFile(
        currentItem.id,
        currentItem.extension,
        (progress) => {
          console.log(`加载进度: ${progress}%`);
        }
      );

      openPreviewDialog(
        result.url, 
        result.type, 
        currentItem.name,
        currentItem.extension  // 传递文件扩展名
      );
    } catch (error) {
      message("预览失败", { type: "error" });
    }
  };

  const formRef = ref();

  const handleDelete = async (currentItem: any) => {
    const id = currentItem.id;
    const res = await deleteFile(id);
    if (res?.code === 200) {
      message("删除成功", { type: "success" });
      onSearch();
    } else {
      message("删除失败", { type: "error" });
    }
  };

  const handleRename = (currentItem: any) => {
    const formRef = ref();
    
    addDialog({
      title: "重命名",
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          name: currentItem.name
        }
      },
      contentRenderer: () => h(FileRename, { 
        ref: formRef,
        formInline: {
          name: currentItem.name
        }
      }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value?.getRef();
        
        try {
          await new Promise((resolve, reject) => {
            FormRef?.validate((valid: boolean) => {
              if (valid) {
                resolve(true);
              } else {
                reject(new Error("表单验证失败"));
              }
            });
          });

          const newName = FormRef?.formData?.value?.name;
          
          if (!newName) {
            message("请输入新名称", { type: "warning" });
            return;
          }

          const res = await renameFile({ 
            id: currentItem.id,
            name: newName
          });
        
          if (res?.code === 200) {
            message("重命名成功", { type: "success" });
            onSearch();
            done(); // 关闭弹窗
          } else {
            message("重命名失败", { type: "error" });
          }
        } catch (err) {
          console.error("表单验证失败", err);
        }
      }
    });
  };

  const handleBatchDownload = async () => {
    try {
      if (diskStore.selectedItems.length === 0) {
        message("请选择要下载的文件", { type: "warning" });
        return;
      }

      const ids = diskStore.selectedItems.map(item => item.id);
      await downloadFiles(ids, (progress) => {
        console.log(`下载进度: ${progress}%`);
      });
      message("下载成功", { type: "success" });
    } catch (error) {
      message("下载失败", { type: "error" });
    }
  };

  const handleBatchDelete = async () => {
    if (diskStore.selectedItems.length === 0) {
      message("请选择要删除的文件", { type: "warning" });
      return;
    }

    const ids = diskStore.selectedItems.map(item => item.id);
    const res = await deleteFiles({ ids });
    if (res?.code === 200) {
      message("删除成功", { type: "success" });
      onSearch();
    } else {
      message("删除失败", { type: "error" });
    }
  };


  const handleBatchRecycleDelete = async () => {
    if (diskStore.selectedItems.length === 0) {
      message("请选择要删除的文件", { type: "warning" });
      return;
    }

    const ids = diskStore.selectedItems.map(item => item.id);
    const res = await deleteRecycles( ids );
    if (res?.code === 200) {
      message("删除成功", { type: "success" });
    } else {
      message("删除失败", { type: "error" });
    }
    await loadRecycleList();
  };

  const handleRecycleDelete = async (id: string) => {
    const res = await deleteRecycle(id);
    if (res?.code === 200) {
      message("删除成功", { type: "success" });
      onSearch();
    } else {
      message("删除失败", { type: "error" });
    }
    await loadRecycleList();
  };

  const handleRestoreRecycle = async (currentItem: any) => {
    const res = await restoreRecycle({
      deleteBatchNum: currentItem.deleteBatchNum,
      path: currentItem.path
    });
    if (res?.code === 200) {
      message("恢复成功", { type: "success" });
    } else {
      message("恢复失败", { type: "error" });
    }
    await loadRecycleList();
  };

  const loadFileList = (type: string) => {
    switch (type) {
      case "my-files":
        // 加载所有文件
        break;
      case "images":
        // 加载图片文件
        break;
      case "documents":
        // 加载文档文件
        break;
      case "videos":
        // 加载视频文件
        break;
      case "others":
        // 加载其他文件
        break;
    }
  };

  const loadRecycleList = async () => {
    try {
      await diskStore.fetchRecycleList();
    } catch (error) {
      message("加载回收站列表失败", { type: "error" });
    }
  };

  const loadShareFileList = async () => {
    try {
      await diskStore.fetchShareFileList();
    } catch (error) {
      message("加载分享列表失败", { type: "error" });
    }
  };



  return {
    form,
    columns,
    uploadProgress,
    handleSelectionChange,
    onSelectionCancel,
    openUploadDialog,
    openFileShareDialog,
    openBatchMoveDialog,
    openNewFolderDialog,
    openPreviewDialog,
    toggleViewMode,
    onSearch,
    handleUpload,
    handleNewFolder,
    handleNewDocument,
    handleSizeChange,
    handleCurrentChange,
    // 返回 store 中的状态
    get loading() { return diskStore.loading },
    get dataList() { return diskStore.dataList },
    get selectedNum() { return diskStore.selectedNum },
    get pagination() { return diskStore.pagination },
    get viewMode() { return diskStore.viewMode },
    get currentPath() { return diskStore.currentPath },
    get selectedItems() { return diskStore.selectedItems },
    get tableRef() { return diskStore.tableRef },
    // ... 其他方法
    handleFileClick,
    handlePathChange,
    handleContextMenuAction,
    fetchFileTree,
    handleBatchDownload,
    handleBatchDelete,
    loadFileList,
    loadShareFileList,
    get recycleList() { return diskStore.recycleList },
    loadRecycleList,
    handleBatchRecycleDelete,
    handleRecycleDelete,
    handleRestoreRecycle
  };
}
