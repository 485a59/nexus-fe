<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useGlobal, deviceDetection } from "@pureadmin/utils";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import LaySidebarTopCollapse from "@/layout/components/lay-sidebar/components/SidebarTopCollapse.vue";
import { useRouter } from "vue-router";

// 图标引入
import Folder from "@iconify-icons/ri/folder-line";
import Image from "@iconify-icons/ri/image-line";
import Document from "@iconify-icons/ri/file-text-line";
import Video from "@iconify-icons/ri/video-line";
import Other from "@iconify-icons/ri/file-line";
import Share from "@iconify-icons/ri/share-line";
import RecycleBin from "@iconify-icons/ri/delete-bin-line";

const { t } = useI18n();

const router = useRouter();

defineOptions({
  name: "FileSidebar"
});

const isOpen = ref(deviceDetection() ? false : true);

// 添加 props 定义
const props = defineProps<{
  defaultActive?: string;
}>();

// 侧边栏菜单项
const menuItems = computed<
  Array<{
    key: string;
    label: string;
    icon: any;
    children?: Array<{
      key: string;
      label: string;
      icon: any;
    }>;
  }>
>(() => {
  return [
    {
      key: "my-files",
      label: t("menus.file.myFiles"),
      icon: Folder,
      children: [
        {
          key: "images",
          label: t("menus.file.images"),
          icon: Image
        },
        {
          key: "documents",
          label: t("menus.file.documents"),
          icon: Document
        },
        {
          key: "videos",
          label: t("menus.file.videos"),
          icon: Video
        },
        {
          key: "others",
          label: t("menus.file.others"),
          icon: Other
        }
      ]
    },
    {
      key: "my-share",
      label: t("menus.file.myShare"),
      icon: Share
    },
    {
      key: "recycle-bin",
      label: t("menus.file.recycleBin"),
      icon: RecycleBin
    }
  ];
});

// 修改 activeMenu 的定义，使用 props 的默认值
const activeMenu = ref(props.defaultActive || "my-files");

// 添加 emit 定义
const emit = defineEmits<{
  (e: "update:menuType", type: string): void;
}>();

// 修改 handleMenuSelect 函数
const handleMenuSelect = (key: string) => {
  activeMenu.value = key;
  // 根据不同的菜单项进行路由跳转
  switch (key) {
    case "my-share":
      router.push("/disk/share");
      break;
    case "recycle-bin":
      router.push("/disk/recycle");
      break;
    case "my-files":
    case "images":
    case "documents":
    case "videos":
    case "others":
      // 跳转到文件列表页面，并传递当前选中的类型
      router.push({
        path: "/disk/index",
        query: { type: key }
      });
      break;
  }
  // 发射事件通知父组件当前选中的菜单类型
  emit("update:menuType", key);
};

// 模拟数据，实际应从API获取
const usedSpace = ref(85 * 1024 * 1024 * 1024); // 85GB
const totalSpace = ref(100 * 1024 * 1024 * 1024); // 100GB

// 计算使用百分比
const spacePercentage = computed(() => {
  return Math.round((usedSpace.value / totalSpace.value) * 100);
});

// 根据使用比例动态设置颜色
const progressColor = computed(() => {
  const percentage = spacePercentage.value;
  if (percentage >= 90) {
    return "#f56c6c"; // 危险红色
  } else if (percentage >= 70) {
    return "#e6a23c"; // 警告黄色
  }
  return "#67c23a"; // 正常绿色
});

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
};
</script>

<template>
  <div class="h-full flex flex-col">
    <el-container class="h-full">
      <!-- 侧边栏 -->
      <el-aside
        v-if="isOpen"
        class="pure-account-settings overflow-hidden px-2 dark:!bg-[var(--el-bg-color)] border-r-[1px] border-[var(--pure-border-color)]"
        :width="deviceDetection() ? '120px' : '180px'"
      >
        <div class="h-full flex flex-col">
          <el-menu
            :default-active="activeMenu"
            class="pure-account-settings-menu flex-1"
            @select="handleMenuSelect"
          >
            <!-- 遍历菜单项 -->
            <template v-for="item in menuItems" :key="item.key">
              <!-- 如果有子菜单 -->
              <el-sub-menu v-if="item.children" :index="item.key">
                <template #title>
                  <div
                    class="flex items-center z-10"
                    @click.stop="handleMenuSelect(item.key)"
                  >
                    <el-icon>
                      <IconifyIconOffline :icon="item.icon" />
                    </el-icon>
                    <span>{{ item.label }}</span>
                  </div>
                </template>
                <!-- 遍历子菜单项 -->
                <el-menu-item
                  v-for="child in item.children"
                  :key="child.key"
                  :index="child.key"
                >
                  <div class="flex items-center z-10">
                    <el-icon>
                      <IconifyIconOffline :icon="child.icon" />
                    </el-icon>
                    <span>{{ child.label }}</span>
                  </div>
                </el-menu-item>
              </el-sub-menu>
              <!-- 如果没有子菜单 -->
              <el-menu-item v-else :index="item.key">
                <div class="flex items-center z-10">
                  <el-icon>
                    <IconifyIconOffline :icon="item.icon" />
                  </el-icon>
                  <span>{{ item.label }}</span>
                </div>
              </el-menu-item>
            </template>
          </el-menu>

          <!-- 存储空间进度条 -->
          <div
            class="p-4 border-t border-[var(--el-border-color)] bg-white dark:bg-[var(--el-bg-color)]"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-[var(--el-text-color-regular)]"
                >存储</span
              >
              <!-- <span class="text-xs text-[var(--el-text-color-secondary)]">
                {{ formatSize(usedSpace) }} / {{ formatSize(totalSpace) }}
              </span> -->
            </div>
            <el-progress
              :percentage="spacePercentage"
              :color="progressColor"
              :status="spacePercentage >= 90 ? 'exception' : ''"
              :stroke-width="8"
              class="storage-progress"
            />
            <div class="mt-1 text-xs text-[var(--el-text-color-secondary)]">
              剩余 {{ formatSize(totalSpace - usedSpace) }}
            </div>
          </div>
        </div>
      </el-aside>

      <!-- 折叠按钮 -->
      <div
        :class="{
          'ml-[20px]': !deviceDetection(),
          'ml-[40px]': deviceDetection()
        }"
        class="m-0 p-0"
      >
        <LaySidebarTopCollapse
          v-if="deviceDetection()"
          class="px-0"
          :is-active="isOpen"
          @toggleClick="isOpen = !isOpen"
        />
      </div>
    </el-container>
  </div>
</template>

<style lang="scss">
.pure-account-settings {
  background: var(--pure-theme-menu-bg) !important;
  height: 100vh; /* 改为100vh以适应全高 */
  overflow: hidden;
}

.pure-account-settings-menu {
  background-color: transparent;
  border: none;
  overflow-y: auto;
  padding-top: 20px;

  .el-menu-item,
  .el-sub-menu__title {
    height: 48px !important;
    color: var(--pure-theme-menu-text);
    background-color: transparent !important;
    transition: color 0.2s;

    &:hover {
      color: var(--pure-theme-menu-title-hover) !important;
    }

    &.is-active {
      color: #fff !important;

      &:hover {
        color: #fff !important;
      }

      &::before {
        position: absolute;
        inset: 0 8px;
        margin: 4px 0;
        clear: both;
        content: "";
        background: var(--el-color-primary);
        border-radius: 3px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
body[layout] {
  .el-menu--vertical .is-active {
    color: #fff !important;
    transition: color 0.2s;

    &:hover {
      color: #fff !important;
    }
  }
}

li.el-menu-item.is-active::before {
  border-radius: 0.5rem !important;
}

.storage-progress :deep(.el-progress-bar__outer) {
  border-radius: 4px;
  background-color: var(--el-fill-color-dark);
}

.storage-progress :deep(.el-progress-bar__inner) {
  border-radius: 4px;
  transition: all 0.3s ease;
}
</style>
