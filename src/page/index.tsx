import VideoItem from "@/component/VideoItem";
import { goTop } from "@/helper";
import { getRecommendVideos, recommendVideos } from "@/service/video";
import { NEmpty, NGrid, NGridItem, NH2, NPagination, NSpin, NText } from "naive-ui";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const loading = ref(false);

    function fetchData(page = 1) {
      loading.value = true;
      getRecommendVideos(page).finally(() => {
        loading.value = false;
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
          {recommendVideos.value.count ? (
            <>
              <div class="video-list mar-b-4-item">
                <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
                  {recommendVideos.value.data.map(item => {
                    return (
                      <NGridItem key={item.id}>
                        <VideoItem video={item}></VideoItem>
                      </NGridItem>
                    );
                  })}
                </NGrid>
              </div>
              <div class="d-flex justify-center">
                <NPagination
                  page={recommendVideos.value.page}
                  pageCount={recommendVideos.value.pageCount}
                  pageSize={recommendVideos.value.pageSize}
                  onUpdatePage={page => {
                    goTop();
                    fetchData(page);
                  }}
                ></NPagination>
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
