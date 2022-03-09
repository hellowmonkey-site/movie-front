import { Button } from "ant-design-vue";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(() => {
      console.log("user");
    });
    return () => (
      <div style="height: 1000px;">
        <Button>aa</Button>
      </div>
    );
  },
});
