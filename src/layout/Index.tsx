import { isIE } from "@/helper/validate";
import { NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, useDialog } from "naive-ui";
import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dialog = useDialog();
    onMounted(() => {
      // 判断是不是IE浏览器
      if (isIE) {
        dialog.warning({
          title: "重要提示",
          content:
            "监测到您当前浏览器版本过低，会影响部分功能的使用，建议使用谷歌、火狐等高级浏览器，或将360等双核心的浏览器切换至极速模式",
          positiveText: "立即升级",
          maskClosable: false,
          onPositiveClick() {
            window.open("https://www.microsoft.com/zh-cn/edge");
            return Promise.reject({ message: "" });
          },
        });
      }
    });
    return () => (
      <NLayout hasSider>
        <NLayoutSider></NLayoutSider>
        <NLayout>
          <NLayoutHeader></NLayoutHeader>
          <NLayoutContent></NLayoutContent>
          <NLayoutFooter></NLayoutFooter>
        </NLayout>
      </NLayout>
    );
  },
});
