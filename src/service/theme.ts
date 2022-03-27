import { darkTheme, GlobalTheme, useOsTheme } from "naive-ui";
import { computed, ref } from "vue";
const os = useOsTheme();

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
export const themeType = ref<ThemeTypes>(ThemeTypes.OS);
export function changeThemeType(type: ThemeTypes) {
  themeType.value = type;
}
export const globalTheme = computed<GlobalTheme | null>(() => {
  if (themeType.value === ThemeTypes.DARK || (themeType.value === ThemeTypes.OS && os.value === "dark")) {
    return darkTheme;
  }
  return null;
});
