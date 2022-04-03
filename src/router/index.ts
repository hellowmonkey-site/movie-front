import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";
import { goTop } from "@/helper";
import { themeOverrides, visitedPageNum } from "@/service/common";

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
        {
          path: "/category/:category",
          props: true,
          name: "category",
          component: () => import("@/page/category"),
        },
        {
          path: "/video/:videoId(\\d+)",
          props: true,
          name: "video",
          component: () => import("@/page/video"),
        },
        {
          path: "/play/:videoId(\\d+)-:playId(\\d+)",
          props: true,
          name: "play",
          component: () => import("@/page/play"),
        },
        {
          path: "/search",
          name: "search",
          component: () => import("@/page/search"),
        },
        {
          path: "/search/history",
          name: "search-history",
          component: () => import("@/page/search-history"),
        },
        {
          path: "/play/history",
          name: "play-history",
          component: () => import("@/page/play-history"),
        },
      ],
    },
    { path: "/login", name: "login", component: () => import("@/page/login") },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/page/404") },
  ],
});

router.beforeEach(() => {
  document.body.setAttribute("style", `--primary-color: ${themeOverrides.value.common?.primaryColor}`);
  goTop();
  NProgress.start();
  return true;
});

router.afterEach(() => {
  visitedPageNum.value = history.length;
  NProgress.done();
});

export default router;
