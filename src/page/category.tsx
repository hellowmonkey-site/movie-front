import VideoItem from "@/component/VideoItem";
import { PageData } from "@/config/type";
import { categorys } from "@/service/category";
import { defaultPageData } from "@/service/common";
import { getCategoryVideos, IVideo } from "@/service/video";
import { NEmpty, NGrid, NGridItem, NH2, NPagination, NResult, NSpin, NText } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();

    const videos = ref<PageData<IVideo>>(defaultPageData);

    const title = computed(() => {
      const category = categorys.value.find(v => v.url === route.params.category);
      return category?.name;
    });
    const loading = ref(false);

    function fetchData(category = route.params.category, page = route.query.page) {
      if (!category) {
        return;
      }
      loading.value = true;
      videos.value = defaultPageData;
      getCategoryVideos(String(category), Number(page))
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
      fetchData(to.params.category, to.query.page);
    });

    return () => (
      <>
        <NH2 prefix="bar">
          <NText>{title.value}</NText>
        </NH2>
        <NSpin show={loading.value}>
          {videos.value.count ? (
            <>
              <div class="video-list mar-b-4-item">
                <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
                  {videos.value.data.map(item => {
                    return (
                      <NGridItem key={item.id}>
                        <VideoItem video={item} tag="definition"></VideoItem>
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
                        page,
                      },
                    })
                  }
                ></NPagination>
              </div>
            </>
          ) : (
            <div class="empty-box">
              {title.value ? (
                <NEmpty description="暂无数据"></NEmpty>
              ) : (
                <NResult status="404" title="分类不存在" description="别瞎搞好吧..."></NResult>
              )}
            </div>
          )}
        </NSpin>
      </>
    );
  },
});
