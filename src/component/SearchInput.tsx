import { SearchFilled } from "@vicons/material";
import { NButton, NIcon, NInput, NInputGroup } from "naive-ui";
import { defineComponent, PropType, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<"icon" | "string">,
      default: "icon",
    },
  },
  emits: ["submit"],
  setup: (props, ctx) => {
    const route = useRoute();
    const keywords = ref(route.query.keywords || "");

    return () => (
      <form
        action=""
        class="d-flex mar-r-3"
        style={{ width: "600px" }}
        onSubmit={e => {
          e.preventDefault();
          ctx.emit("submit", keywords.value);
        }}
      >
        <NInputGroup>
          <NInput placeholder="搜索影视剧..." clearable size="large" v-model={[keywords.value, "value"]} />
          <NButton type="primary" size="large" attrType="submit">
            {props.type === "icon" ? (
              <NIcon size={22}>
                <SearchFilled />
              </NIcon>
            ) : (
              "搜索"
            )}
          </NButton>
        </NInputGroup>
      </form>
    );
  },
});
