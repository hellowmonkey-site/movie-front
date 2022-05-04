import VideoItem from "@/component/VideoItem";
import { PageData } from "@/config/type";
import { pullDownRefresh } from "@/service/plus";
import { categorys } from "@/service/category";
import { defaultPageData, isMobileWidth, setTitle } from "@/service/common";
import { getCategoryVideos, IVideo } from "@/service/video";
import { NButton, NEmpty, NGrid, NGridItem, NH2, NIcon, NPagination, NResult, NSpin, NText } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { goTop } from "@/helper";
import { KeyboardArrowRightOutlined } from "@vicons/material";

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
    const refresh = pullDownRefresh(() => {
      fetchData(route.params.category, 1);
    });

    function fetchData(category = route.params.category, page = Number(route.query.page)) {
      if (!category) {
        return;
      }
      loading.value = true;
      getCategoryVideos(String(category), Number(page))
        .then(data => {
          goTop();
          videos.value = data;
        })
        .finally(() => {
          loading.value = false;
          refresh?.end();
          setTitle(title.value);
        });
    }

    onMounted(() => {
      fetchData();
    });

    onBeforeRouteUpdate(to => {
      fetchData(to.params.category, Number(to.query.page));
    });

    return () => (
      <>
        <div class="d-flex align-items-center justify-between mar-b-3-item">
          <NH2 prefix="bar" class="mar-0">
            <NText>{title.value}</NText>
          </NH2>
          <NButton
            type="tertiary"
            ghost
            icon-placement="right"
            size="small"
            onClick={() => {
              router.push({ name: "random", query: { category: videos.value.data[0].category_id } });
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
        <NSpin show={loading.value}>
          {videos.value.count ? (
            <>
              <div class="video-list mar-b-4-item">
                <NGrid cols="2 s:3 m:4 xl:6" xGap={10} yGap={10} responsive="screen">
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
                  pageSlot={isMobileWidth.value ? 5 : 10}
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
              {categorys.value.length && !title.value ? (
                <NResult status="404" title="分类不存在" description="别瞎搞好吧..."></NResult>
              ) : (
                <NEmpty description="暂无数据"></NEmpty>
              )}
            </div>
          )}
        </NSpin>
      </>
    );
  },
});
