import router from "@/router";
import { NButton, NResult } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <div class="full-height-vh d-flex direction-column align-items-center justify-center" style={{ paddingBottom: "20vh" }}>
        <NResult status="404" title="404 资源不存在" description="生活总归带点荒谬">
          {{
            footer() {
              return <NButton onClick={e => router.replace("/")}>返回首页</NButton>;
            },
          }}
        </NResult>
      </div>
    );
  },
});
