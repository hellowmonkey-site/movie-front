import axios from "axios";
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  components: {},
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => <RouterLink to={{ name: "article-detail", params: { id: 1 } }}>去详情</RouterLink>;
  },
  mounted() {
    axios.get("/");
  },
});
