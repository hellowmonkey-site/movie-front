import fly from "flyio";
import { ref } from "vue";

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

export const recommendVideoList = ref<IVideo[]>([]);
export function getRecommendVideoList() {
  return fly
    .get<IVideo[]>("video/recommend")
    .then(data => data.data)
    .then(data => {
      recommendVideoList.value = data;
      return data;
    });
}
