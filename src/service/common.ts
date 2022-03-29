import config from "@/config";
import { PageData } from "@/config/type";
import { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import { computed, ref } from "vue";
import { darkTheme, GlobalTheme, useOsTheme } from "naive-ui";
import { IPlayerOptions } from "xgplayer";
import { localStorage } from "@/helper/storage";

const os = useOsTheme();

export let notification: NotificationApiInjection;
export function setNotification(e: NotificationApiInjection) {
  notification = e;
}
export let dialog: DialogApiInjection;
export function setDialog(e: DialogApiInjection) {
  dialog = e;
}

export const windowWidth = ref(window.innerWidth);
export const isMobileWidth = computed(() => {
  return windowWidth.value < config.breakpoints.s;
});

// 默认的分页数据
export const defaultPageData: PageData = {
  count: 0,
  pageCount: 1,
  page: 1,
  pageSize: 20,
  data: [],
};

export const enum ThemeTypes {
  OS = "os",
  LIGHT = "light",
  DARK = "dark",
}
export const themeTypes = [
  {
    label: "跟随系统",
    key: ThemeTypes.OS,
  },
  {
    label: "亮色",
    key: ThemeTypes.LIGHT,
  },
  {
    label: "暗色",
    key: ThemeTypes.DARK,
  },
];

// 个性化配置
export interface IConfig {
  // 主题
  themeType: ThemeTypes;

  // 视频
  // 音量
  volume: number;
  // 自动播放
  autoplay: boolean;
  // 播放速度
  playbackRate: number;
  // 视频布局
  fitVideoSize: IPlayerOptions["fitVideoSize"];
  // 画中画
  pip: boolean;
  // 小窗口
  miniplayer: boolean;

  // 推荐
  recommend: boolean;
}
export const fitVideoSizes = [
  {
    text: "自动",
    value: "auto",
  },
  {
    text: "高度自适应",
    value: "fixWidth",
  },
  {
    text: "宽度自适应",
    value: "fixHeight",
  },
];
export const defaultConfig: IConfig = {
  themeType: ThemeTypes.OS,
  volume: 60,
  autoplay: true,
  pip: true,
  miniplayer: true,
  recommend: true,
  playbackRate: 1,
  fitVideoSize: "fixHeight",
};
let localConfig = localStorage.get<IConfig>("appConfig") || defaultConfig;
if (typeof localConfig === "string" || Array.isArray(localConfig)) {
  localConfig = defaultConfig;
}
export const appConfig = ref<IConfig>(defaultConfig);
export function setAppConfig(params: Partial<IConfig>) {
  if (params.themeType !== undefined) {
    const value = params.themeType;
    if (themeTypes.some(v => v.key === value)) {
      appConfig.value.themeType = value;
    }
  }
  if (params.volume !== undefined) {
    const value = Number(params.volume);
    if (value > 0 && value <= 100) {
      appConfig.value.volume = value;
    }
  }
  if (params.playbackRate !== undefined) {
    const value = Number(params.playbackRate);
    if (config.playbackRates.includes(value)) {
      appConfig.value.playbackRate = value;
    }
  }
  if (params.fitVideoSize !== undefined) {
    const value = params.fitVideoSize;
    if (fitVideoSizes.some(v => v.value === value)) {
      appConfig.value.fitVideoSize = value;
    }
  }
  if (params.autoplay !== undefined) {
    appConfig.value.autoplay = Boolean(params.autoplay);
  }
  if (params.pip !== undefined) {
    appConfig.value.pip = Boolean(params.pip);
  }
  if (params.miniplayer !== undefined) {
    appConfig.value.miniplayer = Boolean(params.miniplayer);
  }
  if (params.recommend !== undefined) {
    appConfig.value.recommend = Boolean(params.recommend);
  }
  localStorage.set("appConfig", appConfig.value);
}
setAppConfig(localConfig);

// 菜单
export const menuCollapsed = ref(isMobileWidth.value);
window.addEventListener("resize", e => {
  windowWidth.value = window.innerWidth;
  menuCollapsed.value = isMobileWidth.value;
});

export const themeType = ref<ThemeTypes>(appConfig.value.themeType);
export function changeThemeType(type: ThemeTypes) {
  themeType.value = type;
}
export const globalTheme = computed<GlobalTheme | null>(() => {
  if (themeType.value === ThemeTypes.DARK || (themeType.value === ThemeTypes.OS && os.value === "dark")) {
    return darkTheme;
  }
  return null;
});
