import { version } from "../../package.json";
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const isMsi = false;
const isApp = false;
const isWeb = true;

const baseURL = isDev ? "http://127.0.0.1:7001" : "https://movie.api.hellowmonkey.cc";

export default {
  isDev,
  isProd,
  isWeb,
  isMsi,
  isApp,
  version,
  productName: "hellowmonkey-movie",
  baseURL,
  successCode: 200,
  breakpoints: { xs: 0, s: 640, m: 1024, l: 1280, xl: 1536, xxl: 1920 },
  playbackRates: [0.5, 0.8, 1.0, 1.25, 1.5, 1.8, 2.0, 2.25, 2.5, 3.0],
  appPlaybackRates: [0.5, 0.8, 1.0, 1.25, 1.5, 2.0],
  title: "沃德影视",
  downloadUrl: "resource/app",
  imageUrl: "resource/image",
  videoId: "videoPlayer",
  toolBoxWebUrl: "https://tool.hellowmonkey.cc",
  toolBoxSchemeUrl: "tool-box://",
};

export const Apps = {
  WEB: 1, //浏览器
  APP: 2, //手机app
  MSI: 3, //桌面版
};
