import { compressImage } from "@/helper/file";
import fly from "flyio";
import { reactive, ref } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";

let timer: number;

export const defaultCompressImageOpts = { quality: 0.8, maxWidth: 1300, maxHeight: 1800, convertSize: 1024 * 1024 * 2 };

// 图片上传
export function uploadImage(file: File, compressImageOpts = defaultCompressImageOpts) {
  return compressImage(file, compressImageOpts).then(file => {
    const formData = new FormData();
    formData.append("file", file);
    return fly.post("common/upload", formData).then(data => data.data);
  });
}

// tabs
export const tabList = ref<RouteLocationNormalizedLoaded[]>([]);
export const pushTab = (data: RouteLocationNormalizedLoaded) => {
  if (tabList.value.some(v => v.name === data.name)) {
    return;
  }
  tabList.value.push(data);
};

export const removeTab = (name: string) => {
  tabList.value = tabList.value.filter(v => v.name !== name);
};

// spin
export const loadingState = reactive({
  loading: false,
  tip: "处理中...",
});
export const hideLoading = () => {
  clearTimeout(timer);
  loadingState.loading = false;
};
export const loading = (tip?: string) => {
  clearTimeout(timer);
  timer = setTimeout(hideLoading, 5000);
  loadingState.loading = true;
  loadingState.tip = tip || "处理中...";
  return hideLoading;
};
