import dayjs from "dayjs";
import editForm from "../form.vue";
import { h } from "vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
// import { getSoftwareList } from "@/api/content";
import { ElMessageBox } from "element-plus";
import {
  type Ref,
  ref,
  onMounted,
  reactive
} from "vue";

export function useSoftware(tableRef: Ref) {
  const form = reactive({
    name: "",
    type: "",
    status: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "软件名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "分类",
      prop: "category",
      minWidth: 100
    },
    {
      label: "版本",
      prop: "version",
      minWidth: 90
    },
    {
      label: "平台",
      prop: "platform",
      minWidth: 120
    },
    {
      label: "大小",
      prop: "size",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已发布"
          inactive-text="未发布"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "更新时间",
      minWidth: 100,
      prop: "updateTime"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "下架" : "发布"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>软件吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改软件状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了软件编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    tableRef.value.setAdaptive();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value.getTableRef().clearSelection();
  }

  function onbatchDel() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    message(`已删除软件编号为 ${curSelected.map(item => item.id)} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  // Mock数据
  const mockData = [
    {
      id: 1,
      name: "Visual Studio Code",
      category: "开发工具",
      version: "1.86.0",
      platform: "Windows/Mac/Linux",
      size: "88.5MB",
      status: 1,
      updateTime: "2024-03-21",
      downloadUrl: "/download/software/vscode.exe",
      description: "轻量级但功能强大的代码编辑器"
    },
    {
      id: 2,
      name: "Python数据分析工具包",
      category: "数据分析",
      version: "2.1.0",
      platform: "Windows/Linux",
      size: "156MB",
      status: 1,
      updateTime: "2024-03-20",
      downloadUrl: "/download/software/data-analysis.zip",
      description: "集成了常用数据分析库的Python工具包"
    },
    {
      id: 3,
      name: "农业数据采集系统",
      category: "数据采集",
      version: "3.2.1",
      platform: "Windows",
      size: "45MB",
      status: 1,
      updateTime: "2024-03-19",
      downloadUrl: "/download/software/agri-collector.exe",
      description: "用于农业生产数据的采集与管理"
    },
    {
      id: 4,
      name: "数据可视化平台",
      category: "可视化",
      version: "1.5.0",
      platform: "Web",
      size: "12MB",
      status: 0,
      updateTime: "2024-03-18",
      downloadUrl: "/download/software/data-vis.zip",
      description: "基于Web的数据可视化展示平台"
    },
    {
      id: 5,
      name: "智能灌溉控制软件",
      category: "物联网",
      version: "2.0.0",
      platform: "Windows/Android",
      size: "34MB",
      status: 1,
      updateTime: "2024-03-17",
      downloadUrl: "/download/software/smart-irrigation.apk",
      description: "基于物联网的智能灌溉控制系统"
    }
  ];

  // 修改onSearch函数
  async function onSearch() {
    loading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 根据表单条件筛选数据
    let filteredData = [...mockData];
    
    if (form.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(form.name.toLowerCase())
      );
    }
    
    if (form.type) {
      filteredData = filteredData.filter(item => 
        item.category.toLowerCase() === form.type.toLowerCase()
      );
    }
    
    if (form.status !== "") {
      filteredData = filteredData.filter(item => 
        item.status === parseInt(form.status)
      );
    }
    
    dataList.value = filteredData;
    pagination.total = filteredData.length;
    pagination.pageSize = 10;
    pagination.currentPage = 1;
    
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}软件`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          type: row?.type ?? "",
          version: row?.version ?? "",
          description: row?.description ?? "",
          status: row?.status ?? 1
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            message(`您${title}了软件名称为${curData.name}的这条数据`, {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
} 