import config from "@/config";
import { PageData } from "@/config/type";
import { getFullUrl } from "@/helper";
import fly from "flyio";
import { ref } from "vue";
import { defaultPageData } from "./common";
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

// 首页推荐
export const recommendVideos = ref<PageData<IVideo>>(defaultPageData);
export function getRecommendVideos(page = 1) {
  return fly
    .get<PageData<IVideo>>("video/recommend", { page })
    .then(data => data.data)
    .then(data => {
      recommendVideos.value = data;
      return data;
    });
}

// 分类
export function getCategoryVideos(category: string, page = 1) {
  return fly.get<PageData<IVideo>>("video/category", { category, page }).then(data => data.data);
}

// 详情
export const videoDetail = ref<IVideoDetail>();
export function getVideoDetail(id: number) {
  return fly
    .get<IVideoDetail>(`video/${id}`)
    .then(data => data.data)
    .then(data => {
      return {
        ...data,
        cover: getFullUrl(config.baseURL, data.cover),
        playlist: Array.from(data.playlist).sort((a, b) => (a.title > b.title ? 1 : -1)),
      };
    })
    .then(data => {
      videoDetail.value = data;
      return data;
    });
}

// 搜索
export function getVideoSearch(keywords: string, page = 1) {
  return fly.get<PageData<IVideo>>("video/search", { keywords, page }).then(data => data.data);
}
