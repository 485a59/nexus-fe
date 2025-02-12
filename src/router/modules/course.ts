import { $t } from "@/plugins/i18n";
import { course } from "@/router/enums";

export default {
  path: "/course",
  redirect: "/course/index",
  meta: {
    icon: "ri:book-3-line",
    title: $t("menus.pureCourse"),
    rank: course
  },
  children: [
    {
      path: "/course/index",
      name: "Course",
      component: () => import("@/views/course/index.vue"),
      meta: {
        title: $t("menus.pureCourse")
      }
    }
  ]
} satisfies RouteConfigsTable;
