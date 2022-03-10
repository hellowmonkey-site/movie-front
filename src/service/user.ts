import storage from "@/helper/storage";
import { message } from "ant-design-vue";
import axios from "axios";
import { reactive, ref } from "vue";

const token: string = storage.get("token") as string;
export const userToken = ref<string>(token || "");
export const userInfo = reactive({
  id: 0,
  username: "",
});

// 登录
export const postLogin = (params: any) => {
  return axios
    .post("login", params)
    .then((data: any) => {
      message.success(data.msg);
      return data.data;
    })
    .then(data => {
      const { token, info } = data;
      userToken.value = token;
      userInfo.id = info.id;
      userInfo.username = info.username;
      storage.set("token", token);
      return data;
    });
};
