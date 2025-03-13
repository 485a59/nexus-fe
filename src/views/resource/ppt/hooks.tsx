import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { getPPTTree } from "@/api/curriculum";
import { useScriptTag } from "@vueuse/core";

export const usePPT = () => {
  // 状态管理
  const activeChapters = ref([1]);
  const currentPPT = ref<any>(null);
  const searchKeyword = ref("");
  const chapterList = ref([]);
  
  // OnlyOffice 相关
  const { load: loadDocsAPI } = useScriptTag(
    "http://119.3.188.68:8049/web-apps/apps/api/documents/api.js"
  );
  let docEditor: any = null;

  // 初始化文档编辑器
  const initDocEditor = (ppt: any) => {
    if (!ppt?.url) return;

    // 从URL中获取文件类型和文件名
    const fileUrl = ppt.url;
    const fileName = ppt.name || fileUrl.split("/").pop();
    const fileType = fileUrl.split(".").pop()?.toLowerCase();

    // 获取文档类型
    const getDocumentType = (type: string) => {
      switch (type) {
        case "doc":
        case "docx":
          return "text";
        case "xls":
        case "xlsx":
          return "spreadsheet";
        case "ppt":
        case "pptx":
          return "presentation";
        case "pdf":
          return "text";
        default:
          return "text";
      }
    };

    // 销毁现有实例
    if (docEditor) {
      docEditor.destroyEditor();
    }

    // 创建新的编辑器实例
    docEditor = new (window as any).DocsAPI.DocEditor("placeholder", {
      document: {
        fileType: fileType,
        key: ppt.id || new Date().getTime().toString(),
        title: fileName,
        url: fileUrl
      },
      documentType: getDocumentType(fileType),
      editorConfig: {
        mode: "view",
        lang: "zh",
        customization: {
          autosave: false,
          chat: false,
          comments: false,
          zoom: 100,
          leftMenu: false,
          rightMenu: false,
          header: false
        }
      },
      height: "100%",
      width: "100%"
    });
  };

  // 获取PPT树数据
  const fetchPPTTree = async () => {
    try {
      const { data } = await getPPTTree();
      chapterList.value = data;
    } catch (error) {
      ElMessage.error("获取PPT列表失败");
    }
  };

  // 获取PPT总数
  const getTotalPPTs = () => {
    let count = 0;
    const countPPTs = (items: any[]) => {
      items.forEach(item => {
        if (item.url) {
          count++;
        }
        if (item.children && item.children.length > 0) {
          countPPTs(item.children);
        }
      });
    };
    countPPTs(chapterList.value);
    return count;
  };

  // 预览处理
  const handlePreview = async (ppt: any) => {
    if (!ppt.url) return;
    currentPPT.value = ppt;

    // 确保 API 已加载
    if (!(window as any).DocsAPI) {
      await loadDocsAPI();
    }

    // 初始化编辑器
    initDocEditor(ppt);
  };

  // 下载处理
  const handleDownload = (ppt: any) => {
    if (ppt?.url) {
      window.open(ppt.url);
    } else {
      ElMessage.warning("下载地址不存在");
    }
  };

  // 搜索处理
  const handleSearch = () => {
    ElMessage.info("搜索功能待实现");
  };

  // 检查章节是否包含 PPT
  const hasPPTs = (item: any): boolean => {
    if (item.url) return true;
    if (!item.children) return false;
    return item.children.some((child: any) => hasPPTs(child));
  };

  // 计算章节包含的 PPT 数量
  const countChapterPPTs = (item: any): number => {
    let count = 0;
    if (item.url) count++;
    if (item.children) {
      item.children.forEach((child: any) => {
        count += countChapterPPTs(child);
      });
    }
    return count;
  };

  // 生命周期钩子
  onMounted(() => {
    fetchPPTTree();
  });

  onUnmounted(() => {
    if (docEditor) {
      docEditor.destroyEditor();
    }
  });

  return {
    activeChapters,
    currentPPT,
    searchKeyword,
    chapterList,
    getTotalPPTs,
    handlePreview,
    handleDownload,
    handleSearch,
    hasPPTs,
    countChapterPPTs
  };
}; 