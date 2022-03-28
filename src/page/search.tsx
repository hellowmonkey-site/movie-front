import SearchInput from "@/component/SearchInput";
import VideoItem from "@/component/VideoItem";
import { PageData } from "@/config/type";
import { defaultPageData } from "@/service/common";
import { getVideoSearch, IVideo } from "@/service/video";
import { NEmpty, NGrid, NGridItem, NH2, NPagination, NSpin, NText } from "naive-ui";
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

    function fetchData(keywords = route.query.keywords, page = route.query.page) {
      if (!keywords) {
        return;
      }
      loading.value = true;
      videos.value = defaultPageData;
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
    });

    onBeforeRouteUpdate(to => {
      fetchData(to.query.keywords, to.query.page);
    });

    return () => (
      <>
        <div class="d-flex align-items-center justify-center mar-b-4-item">
          <SearchInput type="string" />
        </div>
        {route.query.keywords ? (
          <>
            <div class="d-flex align-items-center justify-between">
              <NH2 prefix="bar">
                <NText>搜索{route.query.keywords}</NText>
              </NH2>
              <div class="d-flex align-items-center">
                <span class="font-gray">共找到</span>
                <strong class="font-xlg mar-l-1 mar-r-1">{videos.value.count}</strong>
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
                          <NGridItem>
                            <VideoItem video={item}></VideoItem>
                          </NGridItem>
                        );
                      })}
                    </NGrid>
                  </div>
                  <div class="d-flex justify-center">
                    <NPagination
                      page={videos.value.page}
                      pageCount={videos.value.pageCount}
                      pageSize={videos.value.pageSize}
                      onUpdatePage={page =>
                        router.push({
                          name: route.name!,
                          params: route.params,
                          query: {
                            ...route.query,
                            page,
                          },
                        })
                      }
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
        ) : null}
      </>
    );
  },
});
