import { $t } from "@/plugins/i18n";
import { curriculum } from "@/router/enums";

export default {
  path: "/curriculum",
  redirect: "/curriculum/chapter",
  meta: {
    icon: "ri:book-read-line",
    title: $t("menus.pureCurriculum"),
    rank: curriculum
  },
  children: [
    {
      path: "/curriculum/chapter",
      name: "Chapter",
      component: () => import("@/views/curriculum/chapter/index.vue"),
      meta: {
        icon: "ri:list-ordered",
        title: $t("menus.pureChapter")
      }
    },
    {
      path: "/curriculum/inform",
      name: "Inform",
      component: () => import("@/views/curriculum/chapter/index.vue"),
      meta: {
        icon: "ri:notification-badge-line",
        title: $t("menus.pureInform")
      }
    }
  ]
} satisfies RouteConfigsTable;
