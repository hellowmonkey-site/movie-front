import config from "@/config";
import { windowWidth } from "@/service/common";
import { recommendCategoryVideos } from "@/service/video";
import { NGrid, NGridItem, NH2, NText } from "naive-ui";
import { computed } from "vue";
import VideoItem from "./VideoItem";

interface IProp {
  videoId?: number;
}

export default function RecommendList({ videoId }: IProp) {
  const list = computed(() => {
    let length = 2 * 4;
    if (windowWidth.value >= config.breakpoints.xl) {
      length = 6 * 2;
    } else if (windowWidth.value >= config.breakpoints.l) {
      length = 5 * 2;
    } else if (windowWidth.value >= config.breakpoints.m) {
      length = 4 * 3;
    } else if (windowWidth.value >= config.breakpoints.s) {
      length = 3 * 3;
    }
    return recommendCategoryVideos.value.filter(v => v.id !== Number(videoId)).slice(0, length);
  });
  return list.value.length ? (
    <>
      <NH2 prefix="bar">
        <NText>相关推荐</NText>
      </NH2>
      <div class="video-list mar-b-4-item">
        <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
          {list.value.map(item => {
            return (
              <NGridItem key={item.id}>
                <VideoItem video={item}></VideoItem>
              </NGridItem>
            );
          })}
        </NGrid>
      </div>
    </>
  ) : null;
}
