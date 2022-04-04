import flyio, { FlyResponse } from "flyio";
import config, { Apps } from "@/config";
import { filterObject, getType } from "@/helper";
import { isEmpty, isRealEmpty } from "@/helper/validate";
import { KeyType, ResponseData } from "@/config/type";
import { notification, dialog, appConfig } from "@/service/common";
import { user } from "@/service/user";

// request拦截器
flyio.interceptors.request.use(conf => {
  conf.baseURL = config.baseURL;
  conf.headers = {
    ...conf.headers,
    "Content-Type": "application/json;charset=UTF-8",
    app_id: config.isMsi ? Apps.MSI : config.isApp ? Apps.APP : Apps.WEB,
    search_log: appConfig.value.searchLog ? 1 : 0,
    play_log: appConfig.value.playLog ? 1 : 0,
    token: user.value.token,
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
  ({ data }: FlyResponse<ResponseData>) => {
    const status = Number(data.status);
    if (status !== config.successCode) {
      notification.error({
        title: "操作失败",
        content: data.message,
        duration: 3 * 1000,
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
    let message = error?.response?.data?.message || "异常请求";
    if (!message && !isEmpty(error.status)) {
      message = messages[error.status];
    }
    dialog?.error({
      title: "请求失败",
      content: message,
      maskClosable: false,
    });
    return Promise.reject(error);
  }
);
