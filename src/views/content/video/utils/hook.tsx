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

export function useVideo(tableRef: Ref) {
  const form = reactive({
    name: "",
    lecturer: ""
  });
  const formRef = ref();
  const loading = ref(false);
  const { switchStyle } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "视频名称",
      prop: "label",
      minWidth: 200
    },
    {
      label: "讲师",
      prop: "lecturer",
      minWidth: 100
    },
    {
      label: "时长",
      prop: "duration",
      minWidth: 90
    },
    {
      label: "播放量",
      prop: "views",
      minWidth: 90
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  // Mock数据
  const mockData = [
    {
      id: 1,
      label: "第一章 前端工程化基础",
      children: [
        {
          id: 2,
          label: "1.1 现代前端开发概述",
          url: "//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4",
          poster: "https://via.placeholder.com/800x450",
          duration: "12:34",
          lecturer: "张三",
          description: "本节课介绍现代前端开发的基本概念和工具链，帮助你理解前端工程化的重要性。",
          views: 1234
        },
        {
          id: 3,
          label: "1.2 Node.js与npm基础",
          url: "https://www.w3schools.com/html/movie.mp4",
          poster: "https://via.placeholder.com/800x450",
          duration: "15:21",
          lecturer: "李四",
          description: "深入理解Node.js运行时环境和npm包管理工具的使用方法。",
          views: 956
        }
      ]
    },
    {
      id: 4,
      label: "第二章 Vue3核心概念",
      children: [
        {
          id: 5,
          label: "2.1 组合式API详解",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          poster: "https://via.placeholder.com/800x450",
          duration: "20:15",
          lecturer: "王五",
          description: "全面讲解Vue3组合式API的使用方法和最佳实践。",
          views: 2341
        }
      ]
    }
  ];

  const dataList = ref(mockData);

  function handleDelete(row) {
    message(`您删除了${row.children ? '章节' : '视频'}《${row.label}》`, { type: "success" });
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = JSON.parse(JSON.stringify(mockData));
    
    if (form.name || form.lecturer) {
      filteredData = filteredData.map(chapter => {
        const matchedVideos = chapter.children?.filter(video => {
          const nameMatch = !form.name || video.label.toLowerCase().includes(form.name.toLowerCase());
          const lecturerMatch = !form.lecturer || video.lecturer.includes(form.lecturer);
          return nameMatch && lecturerMatch;
        });
        
        if (matchedVideos?.length > 0) {
          return {
            ...chapter,
            children: matchedVideos
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

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}视频`,
      props: {
        formInline: {
          title,
          parentId: row?.parentId ?? "",
          label: row?.label ?? "",
          lecturer: row?.lecturer ?? "",
          description: row?.description ?? "",
          poster: row?.poster ?? "",
          file: null
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
            message(`您${title}了视频《${curData.label}》`, {
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
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    handleDelete
  };
} 