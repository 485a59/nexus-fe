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
import { addTextbook, deleteResource, getChapterList, getTextbookList } from "@/api/curriculum";
import { uploadFile } from "@/api/transfer";
import { handleTree } from "@pureadmin/utils";
const treeData = ref([]);
export function useTextbook(tableRef: Ref) {
  const form = reactive({
    name: "",
    subject: "",
    publisher: "",
    author: ""
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
      label: "教材名称",
      prop: "name",
      minWidth: 180
    },
    {
      label: "出版社",
      prop: "publisher",
      minWidth: 120
    },
    {
      label: "出版日期",
      prop: "publishDate",
      minWidth: 120,
      formatter: ({ publishDate }) =>
        dayjs(publishDate).format("YYYY-MM-DD")
    },
    {
      label: "ISBN",
      prop: "isbn",
      minWidth: 140
    },
    {
      label: "作者",
      prop: "author",
      minWidth: 100
    },
    {
      label: "版次",
      prop: "edition",
      minWidth: 80
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
      publisher: row.publisher,
      publishDate: row.publishDate,
      isbn: row.isbn,
      author: row.author,
      edition: row.edition,
      description: row.description
    });
  }

  async function handleDelete(row) {
    const res = await deleteResource(row.id);
    if (res?.code === 200) {
      message(`您删除了教材${row.name}`, { type: "success" });
    } else {
      message("删除失败", { type: "error" });
    }
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

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize
      };
      
      const data = {
        name: form.name || undefined,
        subject: form.subject || undefined,
        publisher: form.publisher || undefined,
        author: form.author || undefined
      };

      const res = await getTextbookList(data, params);
      if (res?.code === 200) {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      } else {
        message("获取教材列表失败", { type: "error" });
      }
    } catch (error) {
      message("获取教材列表失败", { type: "error" });
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
      title: `${title}教材`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          publisher: row?.publisher ?? "",
          publishDate: row?.publishDate ?? "",
          isbn: row?.isbn ?? "",
          author: row?.author ?? "",
          edition: row?.edition ?? "",
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
                message("请选择教材文件", { type: "warning" });
                return;
              }
              uploadProgress.value = 0;
              const md5 = await uploadFile(file, "/textbook", (progress) => {
                uploadProgress.value = progress;
              });
              
              if (md5 != "") {
                const res = await addTextbook({
                  name: curForm.name,
                  publisher: curForm.publisher,
                  publishDate: curForm.publishDate,
                  isbn: curForm.isbn,
                  author: curForm.author,
                  edition: curForm.edition,
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

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    treeData,
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