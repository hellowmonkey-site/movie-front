import { NumberBoolean, StorageType } from "@/config/type";
import fly from "flyio";
import { IRole } from "./role";

export interface IAdmin {
  username: string;
  role: IRole[];
  id?: number;
  status?: NumberBoolean;
  home_url?: string;
  avatar?: StorageType;
  nickname?: string;
  remark?: string;
  password?: string;
  staff_id?: number;
}

export interface IAdminInput {
  id?: number;
  username: string;
  home_url?: string;
  avatar?: string;
  nickname?: string;
  remark?: string;
  password?: string;
  staff_id?: number;
  role: number[];
}

export const defaultAdmin: IAdmin = {
  username: "",
  home_url: "",
  avatar: null,
  nickname: "",
  remark: "",
  password: "",
  staff_id: 0,
  role: [],
};

// 获取角色列表
export function getAdminList() {
  return fly.get<IAdmin[]>("admin").then(data => data.data);
}

// 获取角色详情
export function getAdminDetail(id: number) {
  return fly.get<IAdmin>(`admin/${id}`).then(data => data.data);
}

// 删除角色
export const deleteAdmin = (id: number) => {
  return fly.delete(`admin/${id}`).then(data => data.data);
};

// 创建角色
export const postAdmin = (params: IAdmin) => {
  return fly.post("admin", params).then(data => data.data);
};

// 编辑角色
export const putAdmin = ({ id, ...params }: IAdmin) => {
  return fly.put(`admin/${id}`, params).then(data => data.data);
};
