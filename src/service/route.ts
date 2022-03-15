import { NumberBoolean } from "@/config/type";
import flyio from "flyio";

export interface IRoute {
  child?: IRoute[];
  deep: NumberBoolean;
  id?: number;
  is_menu: NumberBoolean;
  key: string;
  parent_id: number;
  sort: number;
  title: string;
  url?: string;
}

export const defaultRoute: IRoute = {
  deep: 0,
  is_menu: 1,
  key: "",
  parent_id: 0,
  sort: 0,
  title: "",
  url: "",
};

// 获取路由列表
export const getRouterList = (parent_id = 0) => {
  return flyio.get<IRoute[]>("router", { parent_id }).then(data => data.data);
};

// 获取路由列表
export const getRouterDetail = (id: number) => {
  return flyio.get<IRoute>(`router/${id}`).then(data => data.data);
};

// 删除路由
export const deleteRouter = (id: number) => {
  return flyio.delete(`router/${id}`).then(data => data.data);
};

// 创建路由
export const postRouter = (params: IRoute) => {
  return flyio.post("router", params).then(data => data.data);
};

// 编辑路由
export const putRouter = ({ id, ...params }: IRoute) => {
  return flyio.put(`router/${id}`, params).then(data => data.data);
};
