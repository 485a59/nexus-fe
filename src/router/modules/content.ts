import { $t } from "@/plugins/i18n";
import { content } from "@/router/enums";

export default {
  path: "/content",
  redirect: "/content/software/index",
  meta: {
    icon: "ri:folder-4-line",
    title: $t("menus.pureContent"),
    rank: content
  },
  children: [
    {
      path: "/content/textbook/index",
      // name: "CodeMirror",
      component: () => import("@/views/content/textbook/index.vue"),
      meta: {
        title: $t("menus.pureTextbookManage"),
        icon: "ri:booklet-line",
      }
    },
    {
      path: "/content/video/index",
      // name: "CodeMirror",
      component: () => import("@/views/content/video/index.vue"),
      meta: {
        title: $t("menus.pureVideoManage"),
        icon: "ri:video-download-line",
      }
    },
    {
      path: "/content/software/index",
      // name: "About",
      component: () => import("@/views/content/software/index.vue"),
      meta: {
        icon: "ri:apps-line",
        title: $t("menus.pureSoftwareManage")
      }
    },
    {
      path: "/content/ppt/index",
      // name: "About",
      component: () => import("@/views/content/ppt/index.vue"),
      meta: {
        icon: "ri:file-ppt-line",
        title: $t("menus.purePPTManage")
      }
    }
  ]
} satisfies RouteConfigsTable;
