import { sessionStorage } from "@/helper/storage";
import fly from "flyio";
import { ref } from "vue";
export interface IUserForm {
  username: string;
  password: string;
}

export interface IUser {
  username: string;
  token: string;
  id: number;
}

const defaultUser = {
  username: "",
  token: "",
  id: 0,
};
export const user = ref<IUser>(defaultUser);

export function setUser(params: IUser) {
  user.value = params;
  sessionStorage.set("user", {
    ...params,
  });
}
export function clearUser() {
  sessionStorage.remove("user");
  user.value = defaultUser;
}

export function postLogin(params: IUserForm) {
  return fly
    .post<IUser>("login", params)
    .then(data => data.data)
    .then(data => {
      setUser(data);
      return data;
    });
}
