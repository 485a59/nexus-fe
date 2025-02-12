import { ref } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { storageLocal } from "@pureadmin/utils";
import { responsiveStorageNameSpace } from "@/config";

export const useEpTheme = () => {
  // 使用 vueuse 的 useDark 来管理暗色主题
  const isDark = useDark({
    storageKey: "vueuse-color-scheme",
    valueDark: "dark",
    valueLight: "light"
  });
  
  const toggleDark = useToggle(isDark);

  // 切换主题时同时更新本地存储
  const toggleTheme = () => {
    // 切换暗色/亮色模式
    toggleDark();
    
    // 更新本地存储的主题配置
    const configure = storageLocal().getItem<StorageConfigs>(
      `${responsiveStorageNameSpace()}configure`
    );
    
    if (configure) {
      configure.theme = isDark.value ? "dark" : "light";
      storageLocal().setItem(
        `${responsiveStorageNameSpace()}configure`,
        configure
      );
    }
  };

  return {
    isDark,
    toggleDark: toggleTheme
  };
}; 