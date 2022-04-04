import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";
import "@/plugin/service-worker";
import config from "./config";
import { initSecure } from "./helper/secure";
import { appWindow } from "@tauri-apps/api/window";

function plusready() {
  let timer: NodeJS.Timer;
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      reject();
    }, 1000);
    document.addEventListener(
      "plusready",
      () => {
        clearTimeout(timer);
        resolve(plus);
      },
      false
    );
  });
}

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  try {
    await Promise.all([
      plusready()
        .then(() => {
          config.isApp = true;
          config.isWeb = false;
          router.replace("/");
          setTimeout(() => {
            plus.navigator.closeSplashscreen();
          }, 100);
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
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
    ]);
  } finally {
    app.mount("#app");
  }
});

// 防盗
if (config.isProd) {
  initSecure();
}
