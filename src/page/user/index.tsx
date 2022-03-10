import router from "@/router";
import { Button } from "ant-design-vue";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => (
      <div style="height: 1000px;">
        <Button onClick={e => router.push({ name: "user-detail", params: { id: 2 } })}>去详情</Button>
      </div>
    );
  },
});
