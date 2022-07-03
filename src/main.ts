import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";
// import "@/plugin/service-worker";
import config from "./config";
import { initSecure } from "./helper/secure";
import { appWindow } from "@tauri-apps/api/window";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
import { plusReady, plusSetStatusBar } from "./service/plus";
import { getUserInfo } from "./service/user";
import { isFullscreen, playbackRates } from "./service/common";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  try {
    await Promise.all([
      plusReady()
        .then(() => {
          config.isApp = true;
          config.isWeb = false;
          playbackRates.value = config.appPlaybackRates;
          router.replace("/");
          setTimeout(() => {
            plusSetStatusBar();
            plus.navigator.closeSplashscreen();
          }, 1000);
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
      appWindow
        .isMaximized()
        .then(isMaximized => {
          config.isMsi = true;
          config.isWeb = false;
          if (!isMaximized) {
            appWindow.toggleMaximize();
          }
          appWindow.setFocus();
          appWindow.setResizable(true);
          appWindow.setDecorations(true);
          appWindow.isFullscreen().then(v => {
            isFullscreen.value = v;
          });

          checkUpdate().then(({ shouldUpdate, manifest }) => {
            if (shouldUpdate) {
              installUpdate().then(relaunch);
            }
          });
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
    ]);
    getUserInfo();
  } finally {
    app.mount("#app");
    // 防盗
    if (config.isProd && config.isWeb) {
      initSecure();
    }
    // class
    let cls = "platform-web";
    if (config.isApp) {
      cls = "platform-app";
    } else if (config.isMsi) {
      cls = "platform-msi";
    }
    document.body.classList.add(cls);
  }
});
