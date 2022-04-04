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

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  try {
    await appWindow
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
      .catch(() => {});
  } finally {
    app.mount("#app");
  }

  document.addEventListener(
    "plusready",
    () => {
      config.isApp = true;
      config.isWeb = false;
      router.replace("/");
      setTimeout(() => {
        plus.navigator.closeSplashscreen();
      }, 200);
    },
    false
  );
});

// 防盗
if (config.isProd) {
  initSecure();
}
