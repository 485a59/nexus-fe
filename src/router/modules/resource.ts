import { $t } from "@/plugins/i18n";
import { resource } from "@/router/enums";

export default {
  path: "/resource",
  redirect: "/resource/book",
  meta: {
    icon: "ri:folder-3-line",
    title: $t("menus.pureResource"),
    rank: resource
  },
  children: [
    {
      path: "/course/book",
      // name: "About",
      component: () => import("@/views/resource/textbook/index.vue"),
      meta: {
        title: $t("menus.pureTextbook"),
        icon: "ri:file-list-2-line"
      }
    },
      {
        path: "/course/ppt",
        // name: "About",
        component: () => import("@/views/resource/ppt/index.vue"),
        meta: {
          title: $t("menus.purePPT"),
          icon: "ri:file-ppt-2-line"
        },
        children: [
      {
        path: "ppt",
        component: () => import("@/views/resource/ppt/index.vue"),
        name: "PPTList",
        meta: {
          title: "课件管理"
        }
      },
      {
        path: "ppt/preview/:id",  // 添加预览路由
        component: () => import("@/views/resource/ppt/preview.vue"),
        name: "PPTPreview",
        meta: {
          title: "PPT预览",
          showLink: false  // 在菜单中隐藏此路由
        }
      }
  ]
    },
    {
      path: "/course/video",
      // name: "About",
      component: () => import("@/views/resource/video/index.vue"),
      meta: {
        title: $t("menus.pureVideoResource"),
        icon: "ri:file-video-line"
      }
    },
    {
      path: "/course/software",
      // name: "About",
      component: () => import("@/views/resource/software/index.vue"),
      meta: {
        title: $t("menus.pureSoftware"),
        icon: "ri:app-store-line"
      }
    },
  ]
} satisfies RouteConfigsTable;
