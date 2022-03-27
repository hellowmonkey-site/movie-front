import fly from "flyio";
import { ref } from "vue";

export interface ICategory {
  id: number;
  name: string;
  order: number;
  parent_id: number;
  status: number;
  url: string;
}

export const categorys = ref<ICategory[]>([]);

export function getCategoryList() {
  return fly
    .get<ICategory[]>("category")
    .then(data => data.data)
    .then(data => {
      categorys.value = data;
    });
}
