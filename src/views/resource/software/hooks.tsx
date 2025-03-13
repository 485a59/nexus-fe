import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getSoftwareTree } from "@/api/resource";

interface Software {
  id: string;
  name: string;
  url: string | null;
  version: string | null;
  platform: string | null;
  size: number | null;
  updateTime: string | null;
  description: string | null;
  children: Software[] | null;
}

interface Category {
  id: string;
  name: string;
  children: Software[];
}

export const useSoftware = () => {
  // 状态管理
  const activeCategories = ref([1]);
  const currentSoftware = ref<Software | null>(null);
  const searchKeyword = ref("");
  const softwareList = ref<Category[]>([]);

  // 获取软件列表数据
  const fetchSoftwareList = async () => {
    try {
      const { data } = await getSoftwareTree();
      // 转换数据结构，将 children 重命名为 software
      softwareList.value = data.map(category => ({
        ...category,
        software: category.children || []
      }));
    } catch (error) {
      console.error("获取软件列表失败:", error);
      ElMessage.error("获取软件列表失败");
    }
  };

  // 获取总软件数量
  const getTotalSoftware = () => {
    return softwareList.value.reduce(
      (total, category) => total + (category.software?.length || 0),
      0
    );
  };

  // 处理下载
  const handleDownload = (software: Software) => {
    if (!software?.url) {
      ElMessage.warning("下载地址不存在");
      return;
    }

    ElMessage.success(`开始下载 ${software.name}`);
    // 创建一个临时的 a 标签来下载文件
    const link = document.createElement("a");
    link.href = software.url;
    link.download = software.name + '.zip'; // 假设都是zip文件
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 选择软件
  const handleSelectSoftware = (software: Software) => {
    // 只有有 url 的才是可选的软件
    if (software.url) {
      currentSoftware.value = software;
    }
  };

  // 格式化文件大小
  const formatFileSize = (size: number | null): string => {
    if (size === null) return "未知";
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let fileSize = size;

    while (fileSize >= 1024 && index < units.length - 1) {
      fileSize /= 1024;
      index++;
    }

    return `${fileSize.toFixed(2)} ${units[index]}`;
  };

  // 格式化时间
  const formatTime = (time: string | null): string => {
    if (!time) return "未知";
    return new Date(time).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 初始化
  const initSoftware = () => {
    fetchSoftwareList();
  };

  onMounted(() => {
    initSoftware();
  });

  return {
    activeCategories,
    currentSoftware,
    searchKeyword,
    softwareList,
    getTotalSoftware,
    handleDownload,
    handleSelectSoftware,
    formatFileSize,
    formatTime,
    initSoftware
  };
}; 