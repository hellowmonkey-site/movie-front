import axios, { AxiosRequestConfig } from "axios";
import config from "@/config";
import { filterObject, getType } from "@/helper";
import { isRealEmpty } from "@/helper/validate";
import { KeyType } from "@/config/type";
import { userToken } from "@/service/user";
import { Modal, notification } from "ant-design-vue";

// request拦截器
axios.interceptors.request.use((conf: AxiosRequestConfig) => {
  conf.baseURL = config.baseURL;
  conf.headers = {
    ...conf.headers,
    "Content-Type": "application/json;charset=UTF-8",
  };
  conf.timeout = 0;
  const token = userToken.value;
  if (token) {
    conf.headers["Authorization"] = `Bearer ${token}`;
  }
  // 参数处理
  if (conf.data && getType(conf.data) === "object") {
    const { __filterEmpty = 1, ...query } = conf.data;
    let data = query;
    if (__filterEmpty) {
      data = filterObject(query);
    }
    conf.data = isRealEmpty(data) ? undefined : data;
  }
  return conf;
});

// respone拦截器
axios.interceptors.response.use(
  ({ data }) => {
    const code = Number(data.code);
    if (code !== config.successCode) {
      notification.error({
        message: "操作失败",
        description: data.msg,
      });
      return Promise.reject(data);
    }
    return data;
  },
  (error: any) => {
    type Message = {
      [prop: KeyType]: string;
    };
    // 这里是返回状态码不为200时候的错误处理
    const messages: Message = {
      400: "请求错误",
      401: "未授权，请登录",
      403: "拒绝访问",
      404: `请求地址出错 ${error?.response?.config?.url}`,
      408: "请求超时",
      500: "服务器内部错误",
      501: "服务未实现",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
      505: "HTTP版本不受支持",
    };
    let message = error?.response?.data?.message;
    if (!message && error.status) {
      message = messages[error.status];
    }
    Modal.error({
      title: "请求失败",
      content: message,
    });
    return Promise.reject(error);
  }
);
