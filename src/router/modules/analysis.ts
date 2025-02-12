import { $t } from "@/plugins/i18n";
import { analysis } from "@/router/enums";

export default {
  path: "/analysis",
  redirect: "/analysis/index",
  meta: {
    icon: "ri:line-chart-line",
    title: $t("menus.pureAnalysis"),
    rank: analysis
  },
  children: [
    {
      path: "/analysis/index",
      // name: "About",
      component: () => import("@/views/analysis/index.vue"),
      meta: {
        title: $t("menus.pureAnalysis")
      }
    }
  ]
} satisfies RouteConfigsTable;
