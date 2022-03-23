import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";

import user from "@/router/user";
import system from "@/router/system";
import { pushTab } from "@/service/common";

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      redirect: () => {
        return {
          name: "system-route-index",
        };
      },
      children: [...system],
    },
    ...user,
    { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/page/error/404") },
  ],
});

router.beforeEach(to => {
  if (to.meta.keepAlive) {
    pushTab(to);
  }
  NProgress.start();
  return true;
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
