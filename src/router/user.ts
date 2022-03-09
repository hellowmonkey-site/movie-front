import { RouteRecordRaw } from "vue-router";

const route: RouteRecordRaw[] = [
  {
    name: "user-index",
    path: "/user",
    component: () => import("@/page/user"),
  },
];
export default route;
