import { $t } from "@/plugins/i18n";
import { disk } from "@/router/enums";

export default {
  path: "/disk",
  redirect: "/disk/index",
  meta: {
    icon: "ri:cloudy-2-line",
    title: $t("menus.pureDisk"),
    rank: disk
  },
  children: [
    {
      path: "/disk/index",
      name: "Disk",
      component: () => import("@/views/disk/index.vue"),
      meta: {
        title: $t("menus.pureDisk")
      }
    },
    {
      path: "/disk/share",
      name: "Share",
      component: () => import("@/views/disk/views/ShareList.vue"),
      meta: {
        title: $t("menus.file.myShare"),
        showLink: false
      }
    },
    {
      path: "/disk/recycle",
      name: "Recycle",
      component: () => import("@/views/disk/views/RecycleList.vue"),
      meta: {
        title: $t("menus.file.recycleBin"),
        showLink: false
      }
    },
    {
      path: "/disk/markdown",
      name: "Markdown",
      component: () => import("@/views/markdown/index.vue"),
      meta: {
        title: $t("menus.pureMarkdown"),
        extraIcon: "IF-pure-iconfont-new svg",
        showLink: false
      }
    },
  
    {
      path: "/disk/codemirror",
      name: "CodeMirror",
      component: () => import("@/views/codemirror/index.vue"),
      meta: {
        title: $t("menus.pureCodeMirror"),
        extraIcon: "IF-pure-iconfont-new svg",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
