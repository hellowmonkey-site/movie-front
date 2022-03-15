import { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    name: "system-route",
    path: "/system/route",
    meta: {
      title: "页面设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/route"),
  },
  {
    name: "system-route-add",
    path: "/system/route/add",
    meta: {
      title: "添加页面",
    },
    component: () => import("@/page/system/route-detail"),
  },
  {
    name: "system-route-edit",
    path: "/system/route/:id(\\d+)",
    props: true,
    meta: {
      title: "页面编辑",
    },
    component: () => import("@/page/system/route-detail"),
  },
];
export default systemRoutes;
