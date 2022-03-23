import { NumberBoolean } from "@/config/type";
import fly from "flyio";
import { ref } from "vue";

export interface IRole {
  id: number;
  status?: NumberBoolean;
  name: string;
  home_url?: string;
}

export const defaultRole: IRole = {
  id: 0,
  name: "",
  home_url: "",
};

export const roleList = ref<IRole[]>([]);

// 获取角色列表
export function getRoleList() {
  return fly
    .get<IRole[]>("role")
    .then(data => data.data)
    .then(data => {
      roleList.value = data;
      return data;
    });
}

// 获取角色详情
export function getRoleDetail(id: number) {
  return fly.get<IRole>(`role/${id}`).then(data => data.data);
}

// 删除角色
export const deleteRole = (id: number) => {
  return fly.delete(`role/${id}`).then(data => data.data);
};

// 创建角色
export const postRole = (params: IRole) => {
  return fly.post("role", params).then(data => data.data);
};

// 编辑角色
export const putRole = ({ id, ...params }: IRole) => {
  return fly.put(`role/${id}`, params).then(data => data.data);
};
