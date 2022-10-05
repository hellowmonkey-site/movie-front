import config from "@/config";
import { PageData } from "@/config/type";
import { addZero, getFullUrl } from "@/helper";
import fly from "flyio";
import { computed, ref } from "vue";
import { appConfig, message, videoLength } from "./common";
import { IPlay } from "./playlist";

export interface IVideo {
  actress: string;
  area: string;
  category: string;
  category_id: number;
  cover: string;
  created_at: number;
  definition: string;
  description: string;
  director: string;
  druation: string;
  id: number;
  published_at: number;
  title: string;
}

export interface IVideoDetail extends IVideo {
  playlist: IPlay[];
}

export interface IVideoItem extends IVideo {
  playlist?: IPlay[];
}

export const fullVideoList = ref<IVideoItem[]>([]);
function setFullVideoList(arr: IVideoItem[]) {
  arr.forEach(item => {
    const index = fullVideoList.value.findIndex(v => v.id === item.id);
    if (index === -1) {
      fullVideoList.value.push(item);
    } else if (item.playlist?.length) {
      fullVideoList.value.splice(index, 1, item);
    }
  });
}

export function getInfoList(video?: IVideo) {
  let publishedAt = "";
  if (video?.published_at) {
    const dt = new Date(video.published_at * 1000);
    const arr = [dt.getFullYear(), addZero(dt.getMonth() + 1), addZero(dt.getDate())];
    publishedAt = arr.join("-");
  }
  return [
    {
      text: "分类",
      value: video?.category,
    },
    {
      text: "演员",
      value: video?.actress,
    },
    {
      text: "导演",
      value: video?.director,
    },
    {
      text: "清晰度",
      value: video?.definition,
    },
    {
      text: "地区",
      value: video?.area,
    },
    {
      text: "时长",
      value: video?.druation,
    },
    {
      text: "发布时间",
      value: publishedAt,
    },
  ].filter(v => !!v.value);
}

// 首页推荐
export const recommendVideos = ref<IVideo[]>([]);
export const recommendVideoComputed = computed(() => {
  return recommendVideos.value.slice(0, videoLength.value);
});
export function getRecommendVideos() {
  return fly
    .get<PageData<IVideo>>("video/recommend", { page: 1 })
    .then(data => data.data.data)
    .then(data => {
      recommendVideos.value = data;
      setFullVideoList(data);
      return data;
    });
}

// 分类
export function getCategoryVideos(category: string, page = 1) {
  return fly
    .get<PageData<IVideo>>("video/category", { category, page })
    .then(data => data.data)
    .then(data => {
      setFullVideoList(data.data);
      return data;
    });
}
export const recommendVideoList = ref<IVideo[]>([]);
export function getRecommendVideoList(videoId: number) {
  if (!appConfig.value.recommend) {
    return Promise.resolve([]);
  }
  return fly
    .get<IVideo[]>("video/recommend-list", { videoId })
    .then(data => data.data)
    .then(data => {
      recommendVideoList.value = data;
      setFullVideoList(data);
      return data;
    });
}

// 详情
export function getVideoDetail(id: number) {
  return fly
    .get<IVideoDetail>(`video/${id}`)
    .then(data => data.data)
    .then(data => {
      return {
        ...data,
        cover: getFullUrl(config.baseURL, data.cover),
      };
    })
    .then(data => {
      setFullVideoList([data]);
      return data;
    });
}

// 搜索
export function getVideoSearch({ keywords, category }: { keywords: string; category?: number }, page = 1) {
  return fly
    .get<PageData<IVideo>>("video/search", { keywords, category, page })
    .then(data => data.data)
    .then(data => {
      setFullVideoList(data.data);
      return data;
    });
}

// 提交纠错
export function postReport(remark: string, videoId: number, playId?: number) {
  return fly.post("video/report", { remark, videoId, playId }).then(data => {
    message.success("提交成功，感谢！");
    return data.data;
  });
}

// 随机获取视频
export const randomVideoList = ref<IVideo[]>([]);
export function getRandomVideoList(categoryId?: number) {
  return fly
    .get<IVideo[]>("video/random", { categoryId })
    .then(data => data.data)
    .then(data => {
      randomVideoList.value = data;
      setFullVideoList(data);
      return data;
    });
}
