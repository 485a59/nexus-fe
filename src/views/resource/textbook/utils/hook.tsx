import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getRoleList, getRoleMenu, getRoleMenuIds } from "@/api/system";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch } from "vue";
import BookIcon from "../components/BookIcon.vue";
import { getTextbookList } from "@/api/resource";
import { ElMessage } from "element-plus";

export function useTextbook() {
  const form = reactive({
    name: "",
    type: "",
    subject: ""
  });

  const loading = ref(true);
  const dataList = ref([]);
  const selectedItems = ref([]);
  const selectedNum = ref(0);
  const viewMode = ref<"grid" | "table">("grid");
  const currentPath = ref("/");
  const currentTextbook = ref(null);
  const showPdfViewer = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 表格列配置
  const columns = [
    {
      label: "教材名称",
      prop: "name",
      minWidth: 240,
      cellRenderer: ({ row }) => {
        const displayName = row.name.length > 10 
          ? row.name.slice(0, 10) + '...' 
          : row.name;
        
        return h("div", { 
          class: "flex items-center",
          title: row.name 
        }, [
          h(BookIcon, { 
            text: row.name, // 只传递前两个字给图标
            class: "mx-4"
          }),
          h("span", { 
            class: "truncate max-w-[200px]" 
          }, displayName) 
        ]);
      }
    },
    {
      label: "学科",
      prop: "subject",
      minWidth: 120
    },
    {
      label: "出版社",
      prop: "type",
      minWidth: 100
    },
    {
      label: "大小",
      prop: "size",
      minWidth: 100
    },
    {
      label: "上传时间",
      prop: "uploadTime",
      minWidth: 180,
      formatter: ({ uploadTime }) => dayjs(uploadTime).format("YYYY-MM-DD HH:mm:ss")
    }
  ];

  // 搜索
  const onSearch = async () => {
    loading.value = true;
    try {
      const { data } = await getTextbookList(form);
      dataList.value = data;
    } catch (error) {
      console.error("获取教材列表失败:", error);
      ElMessage.error("获取教材列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 重置表单
  const resetForm = () => {
    form.name = "";
    onSearch();
  };

  // 切换视图模式
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === "grid" ? "table" : "grid";
  };

  // 处理选择变化
  const handleSelectionChange = (items: any[]) => {
    selectedItems.value = items;
    selectedNum.value = items.length;
  };

  // 取消选择
  const onSelectionCancel = () => {
    selectedItems.value = [];
    selectedNum.value = 0;
  };

  // 处理删除
  const handleDelete = async (row: any) => {
    // 实现删除逻辑
    ElMessage.success("删除成功");
    onSearch();
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedItems.value.length === 0) {
      message("请选择要删除的文件", { type: "warning" });
      return;
    }
    message(`已删除 ${selectedItems.value.length} 个文件`, { type: "success" });
    onSearch();
    onSelectionCancel();
  };

  // 打开PDF查看器
  const handleOpenPdf = (textbook: any) => {
    // 检查文件类型和 URL
    if (!textbook.url) {
      ElMessage.warning("文件地址不存在");
      return;
    }
    
    // 检查文件扩展名
    const fileExtension = textbook.url.split(".").pop()?.toLowerCase();
    if (fileExtension !== "pdf") {
      ElMessage.warning("暂不支持该文件格式预览");
      return;
    }

    currentTextbook.value = textbook;
    showPdfViewer.value = true;
  };

  // 关闭PDF查看器
  const handleClosePdf = () => {
    showPdfViewer.value = false;
    currentTextbook.value = null;
  };

  // 处理下载
  const handleDownload = (textbook: any) => {
    if (!textbook.url) {
      ElMessage.warning("文件地址不存在");
      return;
    }
    
    // 创建一个临时的 a 标签来下载文件
    const link = document.createElement("a");
    link.href = textbook.url;
    link.download = textbook.name + "." + textbook.url.split(".").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 获取总教材数量
  const getTotalTextbooks = () => {
    return dataList.value.length;
  };

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    viewMode,
    currentPath,
    selectedItems,
    selectedNum,
    currentTextbook,
    showPdfViewer,
    onSearch,
    resetForm,
    toggleViewMode,
    handleDelete,
    handleBatchDelete,
    handleSelectionChange,
    onSelectionCancel,
    handleOpenPdf,
    handleClosePdf,
    handleDownload,
    getTotalTextbooks
  };
}
