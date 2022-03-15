import storage from "@/helper/storage";
import { message } from "ant-design-vue";
import flyio from "flyio";
import { reactive, ref } from "vue";
import { IRoute } from "./route";

export interface IUser {
  id: number;
  username: string;
}

const token: string = storage.get("token") as string;
export const userToken = ref<string>(token || "");
export const userInfo = reactive<IUser>({
  id: 0,
  username: "",
});
export const userRoutes = ref<string[]>([]);
export const userHandles = ref<string[]>([]);
export const userMenus = ref<IRoute[]>([]);

function setUserToken(data: string) {
  userToken.value = data;
  storage.set("token", data);
}

function setUserInfo(params: { info: IUser; menu_tree: IRoute[]; permissions: string[]; router: string[] }) {
  userInfo.id = params.info.id;
  userInfo.username = params.info.username;
  userRoutes.value = params.router;
  userMenus.value = params.menu_tree;
  userHandles.value = params.permissions;
}

// 登录
export const postLogin = (params: any) => {
  return flyio
    .post("login", params)
    .then((data: any) => {
      message.success(data.msg);
      return data.data;
    })
    .then(data => {
      const { token, ...params } = data;
      setUserToken(token);
      setUserInfo(params);
      return data;
    });
};

// 获取用户信息
export const getUserInfo = () => {
  return flyio
    .get("info")
    .then((data: any) => data.data)
    .then(data => {
      setUserInfo(data);
      return data;
    });
};
