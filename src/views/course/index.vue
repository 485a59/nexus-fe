<script setup lang="ts">
import { getMine } from "@/api/user";
import { ref, onBeforeMount, computed } from "vue";
import Overview from "@/views/course/components/Overview.vue";
import Notice from "@/views/course/components/Notice.vue";
import Criteria from "@/views/course/components/Criteria.vue";
import Evaluation from "@/views/course/components/Evaluation.vue";
import FAQ from "@/views/course/components/FAQ.vue";
import Profile from "@/views/account-settings/components/Profile.vue";
import Preferences from "@/views/account-settings/components/Preferences.vue";
import { useGlobal, deviceDetection } from "@pureadmin/utils";
import AccountManagement from "@/views/account-settings/components/AccountManagement.vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import LaySidebarTopCollapse from "@/layout/components/lay-sidebar/components/SidebarTopCollapse.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

import EyeLine from "@iconify-icons/ri/eye-line";
import QuestionLine from "@iconify-icons/ri/question-line";
import StarLine from "@iconify-icons/ri/star-line";
import Notification2Line from "@iconify-icons/ri/notification-2-line";
import Chat1Line from "@iconify-icons/ri/chat-1-line";

defineOptions({
  name: "Course"
});

const isOpen = ref(deviceDetection() ? false : true);
const { $storage } = useGlobal<GlobalPropertiesApi>();
onBeforeMount(() => {
  useDataThemeChange().dataThemeChange($storage.layout?.overallStyle);
});

const userInfo = ref({
  avatar: "",
  username: "",
  nickname: ""
});
const panes = computed<
  Array<{
    key: string;
    label: string;
    icon: any;
    component: any;
  }>
>(() => {
  return [
    {
      key: "overview",
      label: t("menus.course.pureOverview"),
      icon: EyeLine,
      component: Overview
    },
    {
      key: "notice",
      label: t("menus.course.pureNotice"),
      icon: Notification2Line,
      component: Notice
    },
    {
      key: "criteria",
      label: t("menus.course.pureCriteria"),
      icon: StarLine,
      component: Criteria
    },
    {
      key: "evaluation",
      label: t("menus.course.pureEvaluation"),
      icon: Chat1Line,
      component: Evaluation
    },
    {
      key: "faq",
      label: t("menus.course.pureFAQ"),
      icon: QuestionLine,
      component: FAQ
    }
  ];
});

const witchPane = ref("overview");

getMine().then(res => {
  userInfo.value = res.data;
});
</script>

<template>
  <el-container class="h-full">
    <el-aside
      v-if="isOpen"
      class="pure-account-settings overflow-hidden px-2 dark:!bg-[var(--el-bg-color)] border-r-[1px] border-[var(--pure-border-color)]"
      :width="deviceDetection() ? '120px' : '180px'"
    >
      <el-menu
        :default-active="witchPane"
        class="pure-account-settings-menu pt-5"
      >
        <el-menu-item
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="
            () => {
              witchPane = item.key;
              if (deviceDetection()) {
                isOpen = !isOpen;
              }
            }
          "
        >
          <div class="flex items-center z-10">
            <el-icon>
              <IconifyIconOffline :icon="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
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
      <component :is="panes.find(item => item.key === witchPane).component" />
    </div>
  </el-container>
</template>

<style lang="scss">
.pure-account-settings {
  background: var(--pure-theme-menu-bg) !important;
}

.pure-account-settings-menu {
  background-color: transparent;
  border: none;

  .el-menu-item {
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
</style>
