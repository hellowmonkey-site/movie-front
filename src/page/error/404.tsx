import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import NotFond from "@/static/image/error-404.png";

export default defineComponent({
  components: {},
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <div class="error-page">
        <img src={NotFond} alt="404" />
        <h2 class="tip">哎呀，迷路了...</h2>
        <dl>
          <dt class="mar-b-5">可能的原因：</dt>
          <dd>原来的页面不存在了</dd>
          <dd>您的链接写错了</dd>
        </dl>
        <div class="mar-t-5 d-flex align-items-center justify-center">
          <RouterLink replace class="ant-btn mar-r-2-item" to={{ name: "index" }}>
            首页
          </RouterLink>
          <RouterLink replace class="ant-btn mar-r-2-item" to={{ name: "login" }}>
            重新登录
          </RouterLink>
        </div>
      </div>
    );
  },
});
