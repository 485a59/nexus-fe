// 抽离可公用的工具函数等用于系统管理页面逻辑
import { computed } from "vue";
import { useDark } from "@pureadmin/utils";
import { message } from "@/utils/message";

export const categoryOptions = [
  { label: "开发工具", value: "开发工具" },
  { label: "设计工具", value: "设计工具" },
  { label: "办公软件", value: "办公软件" },
  { label: "仿真模拟", value: "仿真模拟" },
  { label: "科研分析", value: "科研分析" },
  { label: "数据处理", value: "数据处理" },
  { label: "图像处理", value: "图像处理" },
  { label: "其他", value: "其他" }
];

export function usePublicHooks() {
  const { isDark } = useDark();

  const switchStyle = computed(() => {
    return {
      "--el-switch-on-color": "#6abe39",
      "--el-switch-off-color": "#e84749"
    };
  });

  const tagStyle = computed(() => {
    return (status: number) => {
      return status === 1
        ? {
            "--el-tag-text-color": isDark.value ? "#6abe39" : "#389e0d",
            "--el-tag-bg-color": isDark.value ? "#172412" : "#f6ffed",
            "--el-tag-border-color": isDark.value ? "#274a17" : "#b7eb8f"
          }
        : {
            "--el-tag-text-color": isDark.value ? "#e84749" : "#cf1322",
            "--el-tag-bg-color": isDark.value ? "#2b1316" : "#fff1f0",
            "--el-tag-border-color": isDark.value ? "#58191c" : "#ffa39e"
          };
    };
  });

  const handleDownload = (row: any) => {
    if (row.url) {
      const fullUrl = row.url.startsWith("http") ? row.url : `https://${row.url}`;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = row.name; // 使用文件名作为下载名称
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message("下载链接不存在", { type: "warning" });
    }
  };

  return {
    /** 当前网页是否为`dark`模式 */
    isDark,
    /** 表现更鲜明的`el-switch`组件  */
    switchStyle,
    /** 表现更鲜明的`el-tag`组件  */
    tagStyle,
    /** 下载文件 */
    handleDownload,
    categoryOptions  // 导出分类选项
  };
}
