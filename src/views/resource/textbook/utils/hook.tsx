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

  // 模拟数据
  const mockData = [
    {
      id: 1,
      name: "农业信息技术基础",
      subject: "信息技术",
      type: "PDF",
      size: "5.2MB",
      uploadTime: "2024-03-20 10:00:00",
      url: "https://arxiv.org/pdf/2501.10353"
    },
    {
      id: 2,
      name: "数据分析与应用",
      subject: "数据科学",
      type: "PDF",
      size: "3.8MB",
      uploadTime: "2024-03-19 15:30:00",
      url: "path/to/pdf"
    }
  ];

  // 搜索
  async function onSearch() {
    loading.value = true;
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    dataList.value = mockData;
    pagination.total = mockData.length;
    loading.value = false;
  }

  // 重置表单
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
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
  const handleDelete = (row: any) => {
    message(`已删除文件：${row.name}`, { type: "success" });
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
  const openPdfViewer = (textbook: any) => {
    if (!textbook.url) {
      message("PDF文件地址不存在", { type: "error" });
      return;
    }
    window.open(textbook.url, "_blank");
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
    onSearch,
    resetForm,
    toggleViewMode,
    handleDelete,
    handleBatchDelete,
    handleSelectionChange,
    onSelectionCancel,
    openPdfViewer
  };
}
