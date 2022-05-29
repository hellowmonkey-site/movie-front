import fly from "flyio";
import { ref } from "vue";
import { message } from "./common";
import { IVideo } from "./video";

// 获取收藏列表
export const collectVideoList = ref<IVideo[]>([]);
export function getCollectList() {
  return fly
    .get<IVideo[]>("video/collect-list")
    .then(data => data.data)
    .then(data => {
      collectVideoList.value = data;
      return data;
    });
}

// 添加收藏
export function postCollect(videoId: number, playId?: number) {
  return fly.post("video/collect", { videoId, playId }).then(data => {
    getCollectList();
    message.success("收藏成功");
    return data.data;
  });
}

// 取消收藏
export function postCancelCollect(videoId: number) {
  return fly.post("video/collect-cancel", { videoId }).then(data => {
    getCollectList();
    message.success("取消收藏成功");
    return data.data;
  });
}
