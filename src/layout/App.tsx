import { ConfigProvider } from "ant-design-vue";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

export default defineComponent({
  setup() {
    dayjs.locale("zh-cn");
    return () => (
      <ConfigProvider locale={zhCN}>
        <RouterView />
      </ConfigProvider>
    );
  },
});
