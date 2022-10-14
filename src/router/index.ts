import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import Index from "@/layout/Index";
import { filterParams, goTop, putStyle } from "@/helper";
import { isMobileWidth, menuCollapsed, setTitle, themeOverrides, visitedPageNum } from "@/service/common";
import { pullDownRefresh } from "@/service/plus";

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
            level: 1,
            pullDownRefresh: true,
            title: "首页",
          },
          component: () => import("@/page/index"),
        },
        {
          path: "/random",
          name: "random",
          meta: {
            level: 1,
            pullDownRefresh: true,
            title: "随机推荐",
          },
          component: () => import("@/page/random"),
        },
        {
          path: "/category/:category",
          props: true,
          name: "category",
          meta: {
            level: 1,
            pullDownRefresh: true,
            title: "分类",
          },
          component: () => import("@/page/category"),
        },
        {
          path: "/video/:videoId(\\d+)",
          props: true,
          name: "video",
          meta: {
            level: 2,
            pullDownRefresh: false,
            title: "视频详情",
          },
          component: () => import("@/page/video"),
        },
        {
          path: "/play/:videoId(\\d+)-:playId(\\d+)",
          props: true,
          name: "play",
          meta: {
            level: 3,
            pullDownRefresh: false,
            title: "视频播放",
          },
          component: () => import("@/page/play"),
        },
        {
          path: "/search",
          name: "search",
          meta: {
            level: 1,
            pullDownRefresh: true,
            title: "搜索",
          },
          component: () => import("@/page/search"),
        },
        {
          path: "/search/history",
          name: "search-history",
          meta: {
            level: 1,
            pullDownRefresh: true,
            title: "搜索历史",
          },
          component: () => import("@/page/search-history"),
        },
        {
          path: "/play/history",
          name: "play-history",
          meta: {
            level: 1,
            pullDownRefresh: true,
            title: "播放历史",
          },
          component: () => import("@/page/play-history"),
        },
        {
          path: "/collect",
          name: "collect",
          meta: {
            level: 1,
            pullDownRefresh: true,
            title: "我的收藏",
          },
          component: () => import("@/page/collect"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      meta: {
        pullDownRefresh: false,
        title: "登录",
      },
      component: () => import("@/page/login"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      meta: {
        pullDownRefresh: false,
        title: "404",
      },
      component: () => import("@/page/404"),
    },
  ],
});

router.beforeEach(to => {
  // 设置body样式
  const style = putStyle({ "--primary-color": themeOverrides.value.common?.primaryColor });
  document.body.setAttribute("style", style);

  // 参数过滤
  filterParams(to.query);
  filterParams(to.params);

  NProgress.start();

  // 返回顶部
  goTop();

  if (!to.meta.pullDownRefresh) {
    pullDownRefresh(null);
  }

  setTitle(String(to.meta.title || ""));

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
