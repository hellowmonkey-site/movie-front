import VideoItem from "@/component/VideoItem";
import { goTop } from "@/helper";
import { collectVideoList, getCollectList } from "@/service/collect";
import { videoLength } from "@/service/common";
import { pullDownRefresh } from "@/service/plus";
import { NEmpty, NGrid, NGridItem, NH2, NText } from "naive-ui";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const refresh = pullDownRefresh(() => {
      fetchData();
    });
    const dataList = computed(() => {
      return collectVideoList.value.slice(0, videoLength.value);
    });

    function fetchData() {
      getCollectList()
        .then(() => {
          goTop();
        })
        .finally(() => {
          refresh?.end();
        });
    }

    return () => (
      <>
        <NH2 prefix="bar" class="mar-0 mar-b-3-item">
          <NText>我的收藏</NText>
        </NH2>
        {collectVideoList.value.length ? (
          <div class="video-list mar-b-3-item">
            <NGrid cols="2 s:3 m:4 xl:6" xGap={10} yGap={10} responsive="screen">
              {dataList.value.map(item => {
                return (
                  <NGridItem key={item.id}>
                    <VideoItem video={item}></VideoItem>
                  </NGridItem>
                );
              })}
            </NGrid>
          </div>
        ) : (
          <div class="empty-box">
            <NEmpty description="暂无数据"></NEmpty>
          </div>
        )}
      </>
    );
  },
});
