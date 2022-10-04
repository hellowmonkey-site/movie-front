import { KeyType, ObjType } from "@/config/type";
import { isJsonString } from "@/helper/validate";

const s = window.sessionStorage;
const l = window.localStorage;

const fn = (storage = s) => {
  return {
    get<T = ObjType>(key: string): string | T | any[] {
      const data = storage.getItem(key);
      if (data === null) {
        return "";
      }
      if (isJsonString(data)) {
        return JSON.parse(data);
      }
      return data;
    },
    set(key: string, value: any) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      storage.setItem(key, value);
    },
    append(key: string, value: any, mergeKey: any = null) {
      let data = this.get(key);
      if (Array.isArray(data)) {
        if (mergeKey) {
          data.forEach((item, k) => {
            if (item[mergeKey] === value[mergeKey]) {
              (data as any[]).splice(k, 1);
            }
          });
        }
        data.unshift(value);
      } else {
        data = [value];
      }
      this.set(key, data);
    },
    has(key: string, id: KeyType, val: any) {
      const data = this.get(key);
      if (Array.isArray(data)) {
        return data.filter(item => item[id] === val).length > 0;
      }
      return false;
    },
    remove(key: string) {
      storage.removeItem(key);
    },
    clear() {
      storage.clear();
    },
  };
};

export default fn();

export const sessionStorage = fn(s);
export const localStorage = fn(l);

export function getCookie(k: string) {
  const arr = document.cookie.split(";");
  for (let i = 0; i < arr.length; i++) {
    const [key, val] = arr[i].split("=");
    if (key === k) {
      return val;
    }
  }
  return "";
}
