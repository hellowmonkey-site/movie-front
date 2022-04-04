import { version } from "../../package.json";
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const isMsi = false;
const isApp = typeof plus !== "undefined";
const isWeb = !isApp;

export default {
  isDev,
  isProd,
  isWeb,
  isMsi,
  isApp,
  version,
  baseURL: isDev ? "http://127.0.0.1:7001" : "https://movie.api.hellowmonkey.cc",
  successCode: 200,
  breakpoints: { xs: 0, s: 640, m: 1024, l: 1280, xl: 1536, xxl: 1920 },
  playbackRates: [0.5, 1, 1.25, 1.5, 2, 3],
  title: "沃德影视",
  downloadUrl: "resource/app/hellowmonkey.msi",
};

export const Apps = {
  WEB: 1, //浏览器
  APP: 2, //手机app
  MSI: 3, //桌面版
};
