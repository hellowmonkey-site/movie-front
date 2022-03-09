import { RouteRecordRaw } from "vue-router";

const route: RouteRecordRaw[] = [
  {
    name: "article-detail",
    path: "/article/:id(\\d+)",
    component: () => import("@/page/article/detail"),
    meta: {
      keepAlive: true,
    },
  },
];
export default route;
