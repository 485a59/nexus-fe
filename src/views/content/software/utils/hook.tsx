import dayjs from "dayjs";
import editForm from "../form.vue";
import { h } from "vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  type Ref,
  ref,
  onMounted,
  reactive
} from "vue";
import { addSoftware, deleteResource, getSoftwareList } from "@/api/curriculum";
import { uploadFile } from "@/api/transfer";

export function useSoftware(tableRef: Ref) {
  const form = reactive({
    name: "",
    category: "",
    platform: ""
  });
  const formRef = ref();
  const loading = ref(true);
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
      label: "软件名称",
      prop: "name",
      minWidth: 180
    },
    {
      label: "分类",
      prop: "category",
      minWidth: 120
    },
    {
      label: "版本",
      prop: "version",
      minWidth: 100
    },
    {
      label: "平台",
      prop: "platform",
      minWidth: 120
    },
    {
      label: "更新时间",
      minWidth: 120,
      prop: "updateTime",
      formatter: ({ updateTime }) =>
        dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const dataList = ref([]);

  function handleUpdate(row) {
    openDialog("修改", {
      name: row.name,
      category: row.category,
      version: row.version,
      platform: row.platform.split(","),  // 将字符串转为数组
      description: row.description
    });
  }

  async function handleDelete(row) {
    const res = await deleteResource(row.id);
    if (res?.code === 200) {
      message(`您删除了软件${row.name}`, { type: "success" });
      onSearch();
    } else {
      message("删除失败", { type: "error" });
    }
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

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize
      };
      
      const data = {
        name: form.name || undefined,
        category: form.category || undefined,
        platform: form.platform || undefined
      };

      const res = await getSoftwareList(data, params);
      if (res?.code === 200) {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      } else {
        message("获取软件列表失败", { type: "error" });
      }
    } catch (error) {
      message("获取软件列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: any) {
    let uploadProgress = ref(0);
    addDialog({
      title: `${title}软件`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          category: row?.category ?? "",
          version: row?.version ?? "",
          platform: row?.platform ?? [],
          description: row?.description ?? "",
          file: null
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) => h(editForm, {
        ref: formRef,
        formInline: options.props.formInline
      }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curForm = FormRef.form.value;
        
        FormRef.validate(async (valid) => {
          if (valid) {
            try {
              const file = curForm.file;
              if (!file) {
                message("请选择安装包文件", { type: "warning" });
                return;
              }
              uploadProgress.value = 0;
              const md5 = await uploadFile(file, "/software", (progress) => {
                uploadProgress.value = progress;
              });
              
              if (md5 != "") {
                const res = await addSoftware({
                  name: curForm.name,
                  category: curForm.category,
                  version: curForm.version,
                  platform: curForm.platform.toString(),  // 数组转字符串
                  description: curForm.description,
                  identifier: md5
                });

                if (res?.code === 200) {
                  message(`${title}成功`, { type: "success" });
                  done();
                  onSearch();
                } else {
                  message(`${title}失败`, { type: "error" });
                }
              }
            } catch (error) {
              message(`${title}失败`, { type: "error" });
            }
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
    openDialog,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
} 