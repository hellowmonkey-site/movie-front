import { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    name: "system-route-index",
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
  {
    name: "system-role-index",
    path: "/system/role",
    meta: {
      title: "角色设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/role"),
  },
  {
    name: "system-role-add",
    path: "/system/role/add",
    meta: {
      title: "添加角色",
    },
    component: () => import("@/page/system/role-detail"),
  },
  {
    name: "system-role-edit",
    path: "/system/role/:id(\\d+)",
    props: true,
    meta: {
      title: "角色编辑",
    },
    component: () => import("@/page/system/role-detail"),
  },
  {
    name: "system-admin-index",
    path: "/system/admin",
    meta: {
      title: "用户设置",
      keepAlive: true,
    },
    component: () => import("@/page/system/admin"),
  },
  {
    name: "system-admin-add",
    path: "/system/admin/add",
    meta: {
      title: "添加用户",
    },
    component: () => import("@/page/system/admin-detail"),
  },
  {
    name: "system-admin-edit",
    path: "/system/admin/:id(\\d+)",
    props: true,
    meta: {
      title: "用户编辑",
    },
    component: () => import("@/page/system/admin-detail"),
  },
];
export default systemRoutes;
