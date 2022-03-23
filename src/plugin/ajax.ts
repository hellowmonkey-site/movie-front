import flyio from "flyio";
import config from "@/config";
import { filterObject, getType } from "@/helper";
import { isRealEmpty } from "@/helper/validate";
import { KeyType } from "@/config/type";
import { requestHeaders } from "@/service/user";
import { Modal, notification } from "ant-design-vue";
import router from "@/router";

// request拦截器
flyio.interceptors.request.use(conf => {
  conf.baseURL = config.baseURL;
  conf.headers = {
    ...conf.headers,
    "Content-Type": "application/json;charset=UTF-8",
    ...requestHeaders.value,
  };
  conf.timeout = 0;
  // 参数处理
  if (conf.body && getType(conf.body) === "object") {
    const { __filterEmpty = 1, ...query } = conf.body;
    let data = query;
    if (__filterEmpty) {
      data = filterObject(query);
    }
    conf.body = isRealEmpty(data) ? undefined : data;
  }
  return conf;
});

// respone拦截器
flyio.interceptors.response.use(
  ({ data }) => {
    const code = Number(data.code);
    if (code !== config.successCode) {
      notification.error({
        message: "操作失败",
        description: data.msg,
      });
      if (code === config.loginCode) {
        router.replace({ name: "login" });
      }
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
