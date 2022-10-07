import { collectVideoList, postCancelCollect, postCollect } from "@/service/collect";
import { user } from "@/service/user";
import { FavoriteBorderOutlined, FavoriteTwotone } from "@vicons/material";
import { NButton, NTooltip } from "naive-ui";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    videoId: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <>
        {user.value.id && props.videoId ? (
          collectVideoList.value.some(v => v.id === props.videoId) ? (
            <NTooltip>
              {{
                default: () => "已收藏",
                trigger: () => (
                  <NButton size="small" class="mar-r-2-item" type="primary" ghost onClick={() => postCancelCollect(props.videoId)}>
                    {{
                      icon: () => <FavoriteTwotone />,
                    }}
                  </NButton>
                ),
              }}
            </NTooltip>
          ) : (
            <NTooltip>
              {{
                default: () => "点击收藏",
                trigger: () => (
                  <NButton size="small" class="mar-r-2-item" ghost onClick={() => postCollect(props.videoId)}>
                    {{
                      icon: () => <FavoriteBorderOutlined />,
                    }}
                  </NButton>
                ),
              }}
            </NTooltip>
          )
        ) : null}
      </>
    );
  },
});
