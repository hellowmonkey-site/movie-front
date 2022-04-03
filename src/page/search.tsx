import SearchInput from "@/component/SearchInput";
import VideoItem from "@/component/VideoItem";
import { PageData } from "@/config/type";
import { defaultPageData, isMobileWidth } from "@/service/common";
import { getVideoSearch, IVideo } from "@/service/video";
import { getSearchHistory, searchHistorys } from "@/service/history";
import { NButton, NEmpty, NGrid, NGridItem, NH2, NPagination, NSpace, NSpin, NText } from "naive-ui";
import { defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();

    const videos = ref<PageData<IVideo>>(defaultPageData);

    const loading = ref(false);

    function fetchData(keywords = route.query.keywords, page = Number(route.query.page)) {
      if (!keywords) {
        return;
      }
      loading.value = true;
      getVideoSearch(String(keywords), Number(page))
        .then(data => {
          videos.value = data;
        })
        .finally(() => {
          loading.value = false;
        });
    }

    onMounted(() => {
      fetchData();
      if (!route.query.keywords) {
        getSearchHistory();
      }
    });

    return () => (
      <>
        <div class="d-flex align-items-center justify-center mar-b-4-item">
          <SearchInput
            type="string"
            onSubmit={keywords => {
              fetchData(keywords);
              router.push({ name: "search", query: { keywords } });
            }}
          />
        </div>
        {route.query.keywords ? (
          <>
            <div class="d-flex align-items-center justify-between">
              <NH2 prefix="bar">
                <NText>搜索 {route.query.keywords}</NText>
              </NH2>
              <div class="d-flex align-items-center font-small">
                <span class="font-gray">共找到</span>
                <strong class="font-large mar-l-1 mar-r-1">{videos.value.count}</strong>
                <span class="font-gray">条记录</span>
              </div>
            </div>
            <NSpin show={loading.value}>
              {videos.value.count ? (
                <>
                  <div class="video-list mar-b-4-item">
                    <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
                      {videos.value.data.map(item => {
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
                      pageSlot={isMobileWidth.value ? 5 : 10}
                      page={videos.value.page}
                      pageCount={videos.value.pageCount}
                      pageSize={videos.value.pageSize}
                      onUpdatePage={page => fetchData(route.query.keywords, page)}
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
        ) : (
          <NSpace class="text-center" justify="center">
            {searchHistorys.value.map(v => (
              <NButton
                key={v}
                round
                onClick={() => {
                  router.push({ name: "search", query: { keywords: v } });
                }}
              >
                {v}
              </NButton>
            ))}
          </NSpace>
        )}
      </>
    );
  },
});
