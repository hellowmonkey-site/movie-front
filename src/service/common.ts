import config from "@/config";
import { PageData } from "@/config/type";
import { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import { computed, ref } from "vue";

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
  return windowWidth.value < config.breakpoint;
});

// 默认的分页数据
export const defaultPageData: PageData = {
  count: 0,
  pageCount: 1,
  page: 1,
  pageSize: 20,
  data: [],
};

// 菜单
export const menuCollapsed = ref(isMobileWidth.value);
window.addEventListener("resize", e => {
  windowWidth.value = window.innerWidth;
  menuCollapsed.value = isMobileWidth.value;
});
