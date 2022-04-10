import router from "@/router";
import { dialog, globalTheme, menuCollapsed, settingOpen, themeOverrides, ThemeTypes } from "@/service/common";

export const enum PlusOpenTypes {
  NATIVE = 1,
  BROWSER = 2,
}
export interface IPlusVideoPlayer {
  id: string;
  addEventListener: (event: string, listener: (params?: any) => void, capture: boolean) => void;
  setStyles(styles: any): void;
  play(): void;
  pause(): void;
  seek(position: number): void;
  requestFullScreen(): void;
  exitFullScreen(): void;
  stop(): void;
  hide(): void;
  show(): void;
  close(): void;
  playbackRate(rate: number): void;
}

export interface IPlusVideoOptions {
  src: string;
  top: string;
  left: string;
  width: string;
  height: string;
  position: string;
  autoplay: boolean;
  poster: string;
  "show-mute-btn": boolean;
}

export function plusToast(message: string) {
  if (typeof plus === "undefined") {
    return;
  }
  plus.nativeUI.toast(message, {
    duration: "short",
    verticalAlign: "bottom",
  });
}

// 重新加载
export function plusReload() {
  if (typeof plus === "undefined") {
    return;
  }
  const webview = plus.webview.currentWebview();
  webview.reload();
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
      // 图片预览
      const viewerCloseBtn = document.querySelector(".viewer-in .viewer-close") as HTMLElement;
      if (viewerCloseBtn) {
        viewerCloseBtn.click();
        return;
      }
      // 弹框
      if (document.querySelector(".n-modal-container")) {
        dialog?.destroyAll();
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

// 图片预览
export function plusImagePreview(src: string | string[], current = 0) {
  if (typeof plus === "undefined") {
    return;
  }
  let images: string[] = [];
  if (typeof src === "string") {
    images = [src];
  }
  images = images.filter(v => !!v);
  if (!images.length) {
    return;
  }
  plus.nativeUI.previewImage(images, {
    current,
    loop: true,
  });
}

// 下拉刷新
export function pullDownRefresh(cb: null | (() => void)) {
  if (typeof plus === "undefined") {
    return;
  }
  const webview = plus.webview.currentWebview();
  const support = cb !== null;

  webview.setPullToRefresh(
    {
      support,
      style: "circle",
      color: themeOverrides.value.common?.primaryColor,
      offset: "60px",
      auto: false,
    },
    cb
  );

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
export function plusPlayURL(url: string, type: PlusOpenTypes = PlusOpenTypes.BROWSER) {
  if (typeof plus === "undefined") {
    return;
  }
  if (type === PlusOpenTypes.NATIVE) {
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
      plusToast("已降级处理");
      plus.runtime.openURL(url);
    }
  } else {
    plus.runtime.openURL(url);
  }
}

// 视频播放器
export let plusVideoPlayer: IPlusVideoPlayer;
const plusVideoOptions = {
  src: "",
  // top: "61px",
  // left: "0",
  // width: "100%",
  // height: "350px",
  // position: "static",
  autoplay: true,
  poster: "",
  "show-mute-btn": true,
};
export function createPlusVideoPlayer(options: Partial<IPlusVideoOptions>): IPlusVideoPlayer {
  if (plusVideoPlayer) {
    if (options.src === plusVideoOptions.src) {
      plusVideoPlayer.setStyles(options);
      return plusVideoPlayer;
    }
    plusVideoPlayer.close();
  }
  Object.assign(plusVideoOptions, options);
  plusVideoPlayer = new plus.video.VideoPlayer("player", plusVideoOptions);
  return plusVideoPlayer;
}

// 设置状态栏
export function plusSetStatusBar() {
  if (typeof plus === "undefined") {
    return;
  }
  plus.navigator.setStatusBarStyle(globalTheme.value === null ? ThemeTypes.LIGHT : ThemeTypes.DARK);
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
        plus.key.addEventListener(
          "menubutton",
          () => {
            menuCollapsed.value = false;
          },
          false
        );

        resolve(plus);
      },
      false
    );
  });
}
