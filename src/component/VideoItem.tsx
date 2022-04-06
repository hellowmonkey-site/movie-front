import { defineComponent, PropType } from "vue";
import { IVideo } from "@/service/video";
import { useRouter } from "vue-router";
import Image from "./Image";

export default defineComponent({
  props: {
    video: {
      type: Object as PropType<IVideo>,
      default: undefined,
    },
    tag: {
      type: String as PropType<"category" | "definition">,
      default: "category",
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const router = useRouter();
    return () => {
      if (!props.video) {
        return null;
      }
      return (
        <div
          class="video-item"
          onClick={() => {
            router.push({ name: "video", params: { videoId: props.video?.id } });
          }}
        >
          <div class="cover mar-b-4-item">
            <Image src={props.video.cover} preview={false} />
            {props.tag ? <div class="tag font-small">{props.video[props.tag] || props.video.category}</div> : null}
          </div>
          <div class="content">
            <h2 class="font-large text-elip mar-b-2-item">{props.video.title}</h2>
            <div class="font-gray font-small text-elip">{props.video.actress}</div>
          </div>
        </div>
      );
    };
  },
});
