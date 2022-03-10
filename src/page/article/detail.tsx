import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  setup() {
    return () => (
      <div style="height: 2000px;">
        <div>文章详情</div>
        <RouterLink to={{ name: "user-detail", params: { id: 3 } }} replace>
          去用户详情
        </RouterLink>
      </div>
    );
  },
});
