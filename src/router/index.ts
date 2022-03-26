import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: Index,
      children: [
        {
          path: "/",
          name: "index",
          component: () => import("@/page/index"),
        },
      ],
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/page/404") },
  ],
});

router.beforeEach(to => {
  NProgress.start();
  return true;
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
