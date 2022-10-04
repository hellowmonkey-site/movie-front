import config from "@/config";
import router from "@/router";
import { windowWidth } from "@/service/common";
import { recommendVideoList } from "@/service/video";
import { KeyboardArrowRightOutlined } from "@vicons/material";
import { NButton, NGrid, NGridItem, NH2, NIcon, NText } from "naive-ui";
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
    return recommendVideoList.value.filter(v => v.id !== Number(videoId)).slice(0, length);
  });
  return list.value.length ? (
    <>
      <div class="d-flex align-items-center justify-between mar-b-3-item">
        <NH2 prefix="bar" class="mar-0">
          <NText>相关推荐</NText>
        </NH2>
        <NButton
          type="tertiary"
          ghost
          icon-placement="right"
          size="small"
          onClick={() => {
            router.push({ name: "random", query: { category: recommendVideoList.value[0].category_id } });
          }}
        >
          {{
            default() {
              return <span>随机推荐</span>;
            },
            icon() {
              return (
                <NIcon>
                  <KeyboardArrowRightOutlined />
                </NIcon>
              );
            },
          }}
        </NButton>
      </div>
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
