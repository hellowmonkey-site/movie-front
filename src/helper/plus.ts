import router from "@/router";
import { menuCollapsed, settingOpen, themeOverrides } from "@/service/common";

export function plusToast(message: string) {
  if (typeof plus === "undefined") {
    return;
  }
  plus.nativeUI.toast(message, {
    duration: "short",
    verticalAlign: "bottom",
  });
}

// 返回
let backFirst: null | number = null;
export function plusBack() {
  if (typeof plus === "undefined") {
    return;
  }
  const webview = plus.webview.currentWebview();
  const parent = webview.parent();

  if (parent) {
    parent.evalJS("$&&$.back();");
  } else {
    webview.canBack(() => {
      const now = Date.now();
      // 菜单
      if (!menuCollapsed.value) {
        menuCollapsed.value = true;
        return;
      }
      // 设置
      if (settingOpen.value) {
        settingOpen.value = false;
        return;
      }
      if (router.currentRoute.value.name === "index") {
        if (!backFirst) {
          backFirst = now;
          plusToast("再按一次退出应用");
          setTimeout(() => {
            backFirst = null;
          }, 2000);
        } else {
          if (now - backFirst < 2000) {
            plus.runtime.quit();
          }
        }
      } else {
        router.back();
      }
    });
  }
}

// 菜单
export function plusMenu() {
  menuCollapsed.value = false;
}

// 下拉刷新
export function pullDownRefresh(cb: null | (() => void)) {
  if (typeof plus === "undefined") {
    return;
  }
  const webview = plus.webview.currentWebview();
  const support = cb !== null;
  const opts = {
    down: {
      support,
      style: "circle",
      color: themeOverrides.value.common?.primaryColor,
      offset: "60px",
      auto: false,
    },
    up: {
      support: false,
    },
  };

  webview.setPullToRefresh(opts, cb);

  function begin() {
    webview.beginPullToRefresh();
  }

  function end() {
    webview.endPullToRefresh();
  }

  return {
    begin,
    end,
  };
}

// 打开资源
let Intent: any, Uri: any, main: any, intent: any;
export function plusPlayURL(url: string) {
  if (typeof plus === "undefined") {
    return;
  }
  try {
    if (!Intent) {
      Intent = plus.android.importClass("android.content.Intent");
      Uri = plus.android.importClass("android.net.Uri");
      main = plus.android.runtimeMainActivity();
      intent = new Intent(Intent.ACTION_VIEW);
    }
    const uri = Uri.parse(url);
    intent.setDataAndType(uri, "video/*");
    main.startActivity(intent);
  } catch (error) {
    plus.runtime.openURL(url);
  }
}

export function plusReady() {
  let timer: NodeJS.Timer;
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      reject();
    }, 1000);
    document.addEventListener(
      "plusready",
      () => {
        clearTimeout(timer);

        // 返回按钮
        plus.key.addEventListener("backbutton", plusBack, false);

        // 菜单
        plus.key.addEventListener("menubutton", plusMenu, false);

        resolve(plus);
      },
      false
    );
  });
}
