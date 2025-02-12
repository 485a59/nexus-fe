import dayjs from "dayjs";
import editForm from "../form.vue";
import { h } from "vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import {
  type Ref,
  ref,
  onMounted,
  reactive
} from "vue";

export function usePPT(tableRef: Ref) {
  const form = reactive({
    name: "",
    status: ""
  });
  const formRef = ref();
  const loading = ref(false);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const selectedNum = ref(0);

  const columns: TableColumnList = [
    {
      label: "课件名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "作者",
      prop: "author",
      minWidth: 100
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
      minWidth: 120,
      prop: "updateTime"
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  // Mock数据 - 层级结构
  const mockData = [
    {
      id: 1,
      name: "第一章 农业物联网概述",
      children: [
        {
          id: 11,
          name: "1.1 物联网技术导论",
          author: "张教授",
          status: 1,
          updateTime: "2024-03-21",
          size: "2.5MB",
          previewUrl: "/preview/ppt/iot-intro.pdf",
          downloadUrl: "/download/ppt/iot-intro.pptx",
          description: "介绍农业物联网的基本概念和应用场景"
        },
        {
          id: 12,
          name: "1.2 农业物联网架构",
          author: "李博士",
          status: 1,
          updateTime: "2024-03-20",
          size: "3.8MB",
          previewUrl: "/preview/ppt/iot-arch.pdf",
          downloadUrl: "/download/ppt/iot-arch.pptx",
          description: "详解农业物联网的系统架构"
        }
      ]
    },
    {
      id: 2,
      name: "第二章 数据采集技术",
      children: [
        {
          id: 21,
          name: "2.1 传感器技术",
          author: "王教授",
          status: 1,
          updateTime: "2024-03-19",
          size: "4.2MB",
          previewUrl: "/preview/ppt/sensor.pdf",
          downloadUrl: "/download/ppt/sensor.pptx",
          description: "农业传感器技术原理与应用"
        }
      ]
    }
  ];

  const dataList = ref(mockData);

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "下架" : "发布"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>课件吗?`,
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
          message("已成功修改课件状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    openDialog("修改", row);
  }

  function handleDelete(row) {
    message(`您删除了课件编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value.getTableRef().clearSelection();
  }

  function onbatchDel() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    message(`已删除课件编号为 ${curSelected.map(item => item.id)} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = false;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockData];
    
    if (form.name) {
      // 递归搜索子节点
      filteredData = filteredData.map(chapter => {
        const matchedChildren = chapter.children?.filter(item => 
          item.name.toLowerCase().includes(form.name.toLowerCase())
        );
        
        if (matchedChildren?.length > 0) {
          return {
            ...chapter,
            children: matchedChildren
          };
        }
        return null;
      }).filter(Boolean);
    }
    
    if (form.status !== "") {
      // 递归搜索子节点
      filteredData = filteredData.map(chapter => {
        const matchedChildren = chapter.children?.filter(item => 
          item.status === parseInt(form.status)
        );
        
        if (matchedChildren?.length > 0) {
          return {
            ...chapter,
            children: matchedChildren
          };
        }
        return null;
      }).filter(Boolean);
    }
    
    dataList.value = filteredData;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // 新增或修改PPT
  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}课件`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          parentId: row?.parentId ?? "",
          author: row?.author ?? "",
          size: row?.size ?? "",
          status: row?.status ?? 1,
          description: row?.description ?? "",
          downloadUrl: row?.downloadUrl ?? "",
          previewUrl: row?.previewUrl ?? ""
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
            message(`您${title}了课件名称为${curData.name}的这条数据`, {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  return {
    form,
    loading,
    tableRef,
    columns,
    dataList,
    selectedNum,
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