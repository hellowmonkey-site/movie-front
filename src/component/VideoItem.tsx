import { IVideo } from "@/service/video";
import { NCard } from "naive-ui";
import { RouterLink } from "vue-router";

interface IProp {
  video: IVideo;
  tag?: "category" | "definition";
}
export default function VideoItem({ video, tag = "category" }: IProp) {
  return (
    <NCard class="video-item" hoverable>
      {{
        cover: () => (
          <RouterLink
            to={{ name: "video", params: { videoId: video.id } }}
            class="bg-cover pos-rel"
            style={{ backgroundImage: `url('${video.cover}')` }}
          >
            <div class="tag font-small">{video[tag]}</div>
          </RouterLink>
        ),
        default: () => (
          <div class="text-elip">
            <RouterLink to={{ name: "video", params: { videoId: video.id } }} class="font-large">
              {video.title}
            </RouterLink>
          </div>
        ),
        action: () => <div class="font-small text-elip font-gray">{video.actress}</div>,
      }}
    </NCard>
  );
}
