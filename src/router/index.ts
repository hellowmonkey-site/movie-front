import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";

import user from "@/router/user";
import article from "./article";

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
          name: "user-index",
        };
      },
      children: [...user, ...article],
    },
  ],
});

router.beforeEach(() => {
  NProgress.start();
  return true;
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
