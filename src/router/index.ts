import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";
import { goTop, putStyle } from "@/helper";
import { isMobileWidth, menuCollapsed, themeOverrides, visitedPageNum } from "@/service/common";
import { IPlusVideoPlayer, pullDownRefresh } from "@/service/plus";
import config from "@/config";

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/index.html",
      redirect: "/",
    },
    {
      path: "/",
      name: "main",
      component: Index,
      children: [
        {
          path: "/",
          name: "index",
          meta: {
            pullDownRefresh: true,
          },
          component: () => import("@/page/index"),
        },
        {
          path: "/category/:category",
          props: true,
          name: "category",
          meta: {
            pullDownRefresh: true,
          },
          component: () => import("@/page/category"),
        },
        {
          path: "/video/:videoId(\\d+)",
          props: true,
          name: "video",
          meta: {
            pullDownRefresh: false,
          },
          component: () => import("@/page/video"),
        },
        {
          path: "/play/:videoId(\\d+)-:playId(\\d+)",
          props: true,
          name: "play",
          meta: {
            pullDownRefresh: false,
          },
          component: () => import("@/page/play"),
        },
        {
          path: "/search",
          name: "search",
          meta: {
            pullDownRefresh: true,
          },
          component: () => import("@/page/search"),
        },
        {
          path: "/search/history",
          name: "search-history",
          meta: {
            pullDownRefresh: true,
          },
          component: () => import("@/page/search-history"),
        },
        {
          path: "/play/history",
          name: "play-history",
          meta: {
            pullDownRefresh: true,
          },
          component: () => import("@/page/play-history"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      meta: {
        pullDownRefresh: false,
      },
      component: () => import("@/page/login"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      meta: {
        pullDownRefresh: false,
      },
      component: () => import("@/page/404"),
    },
  ],
});

router.beforeEach(to => {
  // 设置body样式
  const style = putStyle({ "--primary-color": themeOverrides.value.common?.primaryColor });
  document.body.setAttribute("style", style);

  // 返回顶部
  goTop();

  // 销毁播放器
  if (config.isApp) {
    const videoPlayer: IPlusVideoPlayer = plus.video.getVideoPlayerById(config.videoId);
    videoPlayer?.close();
  }

  NProgress.start();
  if (!to.meta.pullDownRefresh) {
    pullDownRefresh(null);
  }
  return true;
});

router.afterEach(() => {
  visitedPageNum.value = history.length;
  if (isMobileWidth.value) {
    menuCollapsed.value = true;
  }
  NProgress.done();
});

export default router;
