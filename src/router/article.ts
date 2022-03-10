import { RouteRecordRaw } from "vue-router";

const articleRoutes: RouteRecordRaw[] = [
  {
    name: "article-index",
    path: "/article",
    component: () => import("@/page/article/index"),
    meta: {
      title: "文章列表",
      keepAlive: true,
    },
  },
  {
    name: "article-detail",
    path: "/article/:id(\\d+)",
    component: () => import("@/page/article/detail"),
    meta: {
      title: "文章详情",
    },
  },
];
export default articleRoutes;
