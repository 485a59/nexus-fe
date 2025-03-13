import dayjs from "dayjs";
import editForm from "../form.vue";
import { h } from "vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, handleTree } from "@pureadmin/utils";
import {
  type Ref,
  ref,
  onMounted,
  reactive
} from "vue";
import { addSlide, deleteResource, getChapterList, getSlideList, getVideoList } from "@/api/curriculum";
import { uploadFile } from "@/api/transfer";

export function usePPT() {
  const form = reactive({
    name: "",
    chapterName: "",
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
      label: "课件名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "所属章节",
      prop: "chapterName",
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

  // Mock数据 - 树形结构
  const treeData = ref([]);
  const dataList = ref([]);

  function handleUpdate(row) {
    openDialog("修改", {
      label: row.name,
      chapterId: row.chapterId,
      author: row.author,
      description: row.description
    });
  }

  async function handleDelete(row) {
    const res = await deleteResource(row.id);
    if (res?.code === 200) {
      message(`您删除了课件${row.name}`, { type: "success" });
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
        chapterName: form.chapterName || undefined
      };

      const res = await getSlideList(data, params);
      if (res?.code === 200) {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      } else {
        message("获取课件列表失败", { type: "error" });
      }
    } catch (error) {
      message("获取课件列表失败", { type: "error" });
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
      title: `${title}课件`,
      props: {
        formInline: {
          title,
          label: row?.label ?? "",
          chapterId: row?.chapterId ?? "",
          author: row?.author ?? "",
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
                message("请选择课件文件", { type: "warning" });
                return;
              }
              uploadProgress.value = 0;
              const md5 = await uploadFile(file, "/ppt", (progress) => {
                uploadProgress.value = progress;
              });
              
              if (md5 != "") {
                const res = await addSlide({
                  name: curForm.label,
                  chapterId: curForm.chapterId,
                  author: curForm.author,
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
    const { data } = await getChapterList({});
    treeData.value = handleTree(data);
    const { data: vdata } = await getVideoList({});
    let videoData = handleTree(vdata.list, "chapterId", "parentChapterId", "children");
    console.log("视频分层",videoData);
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
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