import fly from "flyio";
import { computed, ref } from "vue";
import { appConfig } from "./common";
import { IVideo, setFullVideoList } from "./video";

interface IPlayHistoryItem extends IVideo {
  play_id: number;
}
export interface IPlayHistory {
  datetime: string;
  list: IPlayHistoryItem[];
}

// 记录播放数据
export function postPlayLog(videoId: number, playId: number) {
  if (!appConfig.value.playLog) {
    return;
  }
  return fly.post("history/play-log", { videoId, playId }).then(data => data.data);
}

// 获取搜索记录
export const searchHistorys = ref<string[]>([]);
export function getSearchHistory() {
  return fly
    .get<string[]>("history/search-history")
    .then(data => data.data)
    .then(data => {
      searchHistorys.value = data;
      return data;
    });
}

// 清除搜索记录
export function deleteSearchHistory() {
  return fly.delete("history/search-history").then(data => data.data);
}

// 获取播放历史
export const playHistorys = ref<IPlayHistory[]>([]);
export const playHistoryIds = computed(() => {
  const arr: number[] = [];
  playHistorys.value.forEach(item => {
    item.list.forEach(v => {
      arr.push(v.play_id);
    });
  });
  return arr;
});
export function getPlayHistory() {
  return fly
    .get<IPlayHistory[]>("history/play-history")
    .then(data => data.data)
    .then(data => {
      playHistorys.value = data;
      data.forEach(item => {
        setFullVideoList(item.list);
      });
      return data;
    });
}

// 清除播放记录
export function deletePlayHistory() {
  return fly.delete("history/play-history").then(data => data.data);
}
