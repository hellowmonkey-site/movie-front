import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => <div>index page</div>;
  },
});
