import { SearchFilled } from "@vicons/material";
import { NButton, NIcon, NInput, NInputGroup } from "naive-ui";
import { defineComponent, PropType, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<"icon" | "string">,
      default: "icon",
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();
    const keywords = ref(route.query.keywords || "");

    return () => (
      <form
        action=""
        class="d-flex mar-r-3"
        style={{ width: "600px" }}
        onSubmit={e => {
          e.preventDefault();
          if (!keywords.value) {
            return;
          }
          router.push({ name: "search", query: { keywords: keywords.value } });
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
