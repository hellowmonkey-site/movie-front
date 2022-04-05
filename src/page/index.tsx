import VideoItem from "@/component/VideoItem";
import { pullDownRefresh } from "@/helper/plus";
import { getRecommendVideos, recommendVideoComputed } from "@/service/video";
import { NEmpty, NGrid, NGridItem, NH2, NSpin, NText } from "naive-ui";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const loading = ref(false);
    const refresh = pullDownRefresh(fetchData);

    function fetchData() {
      loading.value = true;
      getRecommendVideos().finally(() => {
        loading.value = false;
        refresh?.end();
      });
    }

    onMounted(() => {
      fetchData();
    });

    return () => (
      <>
        <NH2 prefix="bar">
          <NText>最新推荐</NText>
        </NH2>
        <NSpin show={loading.value}>
          {recommendVideoComputed.value.length ? (
            <>
              <div class="video-list mar-b-4-item">
                <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
                  {recommendVideoComputed.value.map(item => {
                    return (
                      <NGridItem key={item.id}>
                        <VideoItem video={item}></VideoItem>
                      </NGridItem>
                    );
                  })}
                </NGrid>
              </div>
            </>
          ) : (
            <div class="empty-box">
              <NEmpty description="暂无数据"></NEmpty>
            </div>
          )}
        </NSpin>
      </>
    );
  },
});
