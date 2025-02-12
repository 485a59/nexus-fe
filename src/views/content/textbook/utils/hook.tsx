import dayjs from "dayjs";
import editForm from "../form.vue";
import { h } from "vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import {
  type Ref,
  ref,
  reactive
} from "vue";
import { uploadFile } from "@/api/transfer";
import { addTextbook } from "@/api/curriculum";

export function useTextbook(tableRef: Ref) {
  const form = reactive({
    name: "",
    subject: "",
    publisher: "",
    author: ""
  });
  const formRef = ref();
  const loading = ref(false);
  const { switchStyle } = usePublicHooks();

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
      formatter: (row) => {
        return dayjs(row.publishDate).format("YYYY-MM-DD");
      }
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
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  // Mock数据
  const mockData = [
    {
      id: 1,
      name: "Python程序设计",
      publisher: "高等教育出版社",
      publishDate: "2024-01-15",
      isbn: "978-7-0401-5832-1",
      author: "张三",
      edition: "第2版",
      subject: "信息技术",
      description: "本教材系统介绍Python编程基础知识",
      type: "PDF",
      updateTime: "2024-03-21",
      url: "/preview/textbook/python-programming.pdf"
    },
    {
      id: 2,
      name: "农业物联网导论",
      publisher: "中国农业出版社",
      publishDate: "2024-02-20",
      isbn: "978-7-1091-2371-4",
      author: "李四",
      edition: "第1版",
      subject: "物联网",
      description: "介绍农业物联网的基本概念和应用",
      type: "PDF",
      updateTime: "2024-03-20",
      url: "/preview/textbook/iot-introduction.pdf"
    },
    {
      id: 3,
      name: "现代农业技术",
      publisher: "农业科学出版社",
      publishDate: "2024-03-10",
      isbn: "978-7-5628-4159-7",
      author: "王五",
      edition: "第3版",
      subject: "农业技术",
      description: "全面介绍现代农业技术的发展与应用",
      type: "PDF",
      updateTime: "2024-03-19",
      url: "/preview/textbook/modern-agriculture.pdf"
    }
  ];

  const dataList = ref(mockData);

  function handleDelete(row) {
    message(`您删除了教材《${row.name}》`, { type: "success" });
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockData];
    
    if (form.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(form.name.toLowerCase())
      );
    }
    
    if (form.subject) {
      filteredData = filteredData.filter(item => 
        item.subject === form.subject
      );
    }
    
    dataList.value = filteredData;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: any) {
    const formRef = ref();
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
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        if (!FormRef) {
          message("表单实例获取失败", { type: "error" });
          return;
        }

        const curForm = FormRef.form?.value;
        if (!curForm) {
          message("表单数据获取失败", { type: "error" });
          return;
        }
        
        FormRef.validate(async valid => {
          if (valid) {
            try {
              // 检查是否有文件需要上传
              const file = curForm.file;
              if (!file) {
                message("请选择教材文件", { type: "warning" });
                return;
              }

              // 上传文件并获取返回值
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
                if (res.code === 200) {
                  done();
                  message(`教材《${curForm.name}》上传成功`, {
                    type: "success"
                  });
                  onSearch();
                } else {
                  message("文件上传失败", { type: "error" });
                }
              } else {
                message("文件上传失败", { type: "error" });
              }
            } catch (error) {
              console.error("error", error);
              message("文件上传失败", { type: "error" });
            }
          } else {
            message("请填写完整的教材信息", { type: "warning" });
          }
        });
      }
    });
  }

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    handleDelete
  };
} 