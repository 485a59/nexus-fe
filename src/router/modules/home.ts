import { $t } from "@/plugins/i18n";
import { home } from "@/router/enums";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "ri:home-2-line",
    title: $t("menus.pureHome"),
    rank: home
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: $t("menus.pureHome"),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/recommend/course1",
      name: "https://www.icourse163.org/course/ZJITC-1464206161?from=searchPage&outVendor=zw_mooc_pcssjg_",
      meta: {
        title: "menus.pureColorHuntDoc",
        keepAlive: true,
        showLink: false,
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/uigradients",
      name: "FrameUiGradients",
      meta: {
        title: "menus.pureUiGradients",
        frameSrc: "https://uigradients.com/",
        keepAlive: true,
        showLink: false
      }
    },
  ]
} satisfies RouteConfigsTable;
