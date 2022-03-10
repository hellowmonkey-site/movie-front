import { RouteRecordRaw } from "vue-router";

const userRoutes: RouteRecordRaw[] = [
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () => import("@/page/user/login"),
  },
];
export default userRoutes;
