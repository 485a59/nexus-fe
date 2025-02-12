<script setup lang="ts">
import { emitter } from "@/utils/mitt";
import { useNav } from "@/layout/hooks/useNav";
import LaySearch from "../lay-search/index.vue";
import LayNotice from "../lay-notice/index.vue";
import { responsiveStorageNameSpace } from "@/config";
import { computed, nextTick, onMounted, ref } from "vue";
import { isAllEmpty, storageLocal } from "@pureadmin/utils";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LaySidebarItem from "../lay-sidebar/components/SidebarItem.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";
import { useDark, useToggle } from "@vueuse/core";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import MenuFold from "@iconify-icons/ri/menu-fold-fill";
import MenuUnfold from "@iconify-icons/ri/menu-unfold-fill";
const { dataTheme, dataThemeChange } = useDataThemeChange();

import GlobalizationIcon from "@/assets/svg/globalization.svg?component";
import AccountSettingsIcon from "@iconify-icons/ri/user-settings-line";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import Check from "@iconify-icons/ep/check";

const menuRef = ref();
const showLogo = ref(
  storageLocal().getItem<StorageConfigs>(
    `${responsiveStorageNameSpace()}configure`
  )?.showLogo ?? true
);

const { t, route, locale, translationCh, translationEn } =
  useTranslationLang(menuRef);
const {
  title,
  logout,
  onPanel,
  getLogo,
  username,
  userAvatar,
  backTopMenu,
  avatarsStyle,
  toAccountSettings,
  getDropdownItemStyle,
  getDropdownItemClass,
  layout,
  toggleLayout,
  device
} = useNav();

const isDark = useDark({
  storageKey: "vueuse-color-scheme",
  valueDark: "dark",
  valueLight: "light"
});
const toggleDark = useToggle(isDark);

const defaultActive = computed(() =>
  !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path
);

nextTick(() => {
  menuRef.value?.handleResize();
});

onMounted(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});
</script>

<template>
  <div
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
    class="horizontal-header pl-10 justify-around"
  >
    <div v-if="showLogo" class="horizontal-header-left" @click="backTopMenu">
      <img :src="getLogo()" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu
      ref="menuRef"
      mode="horizontal"
      popper-class="pure-scrollbar"
      class="horizontal-header-menu"
      :default-active="defaultActive"
    >
      <LaySidebarItem
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 主题切换 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <el-dropdown id="header-translation" trigger="click">
        <GlobalizationIcon
          class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <span v-show="locale === 'zh'" class="check-zh">
                <IconifyIconOffline :icon="Check" />
              </span>
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-en">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 全屏 -->
      <LaySidebarFullScreen id="full-screen" />
      <!-- 消息通知 -->
      <LayNotice id="header-notice" />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-item @click="toAccountSettings">
            <IconifyIconOffline
              :icon="AccountSettingsIcon"
              style="margin: 5px"
            />
            {{ t("buttons.pureAccountSettings") }}
          </el-dropdown-item>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              {{ t("buttons.pureLoginOut") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 主题切换 -->
      <!-- <div
        class="theme-switch navbar-bg-hover"
        :class="[device === 'mobile' ? 'mobile' : 'pc']"
        @click="toggleDark()"
      >
        <IconifyIconOffline
          :icon="isDark ? Sun : Moon"
          class="w-[40px] h-[48px] p-[11px] cursor-pointer outline-none"
        />
      </div> -->

      <!-- 导航模式切换 -->
      <div
        class="layout-switch navbar-bg-hover"
        :class="[device === 'mobile' ? 'mobile' : 'pc']"
        @click="toggleLayout()"
      >
        <IconifyIconOffline
          :icon="layout === 'vertical' ? MenuUnfold : MenuFold"
          class="w-[40px] h-[48px] p-[11px] cursor-pointer outline-none"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}

.horizontal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: var(--el-bg-color);
  height: 50px;
  border-bottom: 1px solid var(--el-border-color-light);
  transition: background-color 0.3s;

  .horizontal-header-left {
    span {
      color: var(--el-text-color-primary);
      transition: color 0.3s;
    }
  }
}

.horizontal-header-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  height: 50px;
  line-height: 50px;
  border: none;
}

.horizontal-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-switch,
.layout-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  padding: 0 2px;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &.mobile {
    padding: 0;
  }

  &.pc {
    width: 40px;
    height: 48px;
  }
}

// 暗黑模式下的样式调整
:root[data-theme="dark"] {
  .horizontal-header {
    background: var(--el-bg-color);
    border-bottom-color: var(--el-border-color-extra-light);

    .horizontal-header-left span {
      color: var(--el-text-color-primary);
    }
  }

  .theme-switch,
  .layout-switch {
    &:hover {
      background-color: var(--el-fill-color-dark);
    }
  }
}
</style>
