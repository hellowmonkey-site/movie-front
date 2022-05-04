import SearchInput from "@/component/SearchInput";
import VideoItem from "@/component/VideoItem";
import { PageData } from "@/config/type";
import { defaultPageData, isMobileWidth } from "@/service/common";
import { getVideoSearch, IVideo } from "@/service/video";
import { getSearchHistory, searchHistorys } from "@/service/history";
import { NButton, NButtonGroup, NDropdown, NEmpty, NGrid, NGridItem, NH2, NIcon, NPagination, NSpace, NSpin, NText } from "naive-ui";
import { defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { pullDownRefresh } from "@/service/plus";
import { ClearOutlined, KeyboardArrowDownOutlined } from "@vicons/material";
import { categorys, ICategory } from "@/service/category";
import { goTop } from "@/helper";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();
    const refresh = pullDownRefresh(() => {
      fetchData({ ...route.query, page: 1 });
    });

    const videos = ref<PageData<IVideo>>(defaultPageData);

    const loading = ref(false);

    function fetchData({
      keywords = route.query.keywords,
      category = Number(route.query.category) || undefined,
      page = Number(route.query.page || 1),
    } = {}) {
      if (!keywords) {
        return;
      }
      loading.value = true;
      getVideoSearch({ keywords: String(keywords), category }, Number(page))
        .then(data => {
          goTop();
          videos.value = data;
        })
        .finally(() => {
          loading.value = false;
          refresh?.end();
        });
    }

    onMounted(() => {
      if (route.query.keywords) {
        fetchData();
      } else {
        getSearchHistory();
      }
    });

    onBeforeRouteUpdate(to => {
      fetchData(to.query);
    });

    return () => (
      <>
        <div class="d-flex align-items-center justify-center mar-b-4-item">
          <SearchInput
            type="string"
            onSubmit={keywords => {
              router.push({ name: "search", query: { ...route.query, page: 1, keywords } });
            }}
          />
        </div>
        {route.query.keywords ? (
          <>
            <div class="d-flex align-items-center justify-between mar-b-3-item">
              <NH2 prefix="bar" class="mar-0">
                <NText>搜索 {route.query.keywords}</NText>
              </NH2>
              <div class="d-flex align-items-center font-small">
                <span class="font-gray">共找到</span>
                <strong class="font-large mar-l-1 mar-r-1">{videos.value.count}</strong>
                <span class="font-gray mar-r-3-item">条记录</span>
                <NButtonGroup>
                  <NDropdown
                    trigger="click"
                    options={categorys.value.map((item: ICategory) => ({
                      key: item.id,
                      label: item.name,
                    }))}
                    value={Number(route.query.category) || null}
                    onSelect={category => {
                      router.push({ name: "search", query: { ...route.query, page: 1, category } });
                    }}
                  >
                    <NButton type="tertiary" ghost icon-placement="right" size="tiny">
                      {{
                        default() {
                          return <span>{categorys.value.find(v => v.id === Number(route.query.category))?.name || "筛选分类"}</span>;
                        },
                        icon() {
                          return (
                            <NIcon>
                              <KeyboardArrowDownOutlined />
                            </NIcon>
                          );
                        },
                      }}
                    </NButton>
                  </NDropdown>
                  {route.query.category ? (
                    <NButton
                      size="tiny"
                      onClick={() => {
                        router.push({ name: "search", query: { ...route.query, page: 1, category: undefined } });
                      }}
                    >
                      {{
                        icon() {
                          return <ClearOutlined />;
                        },
                      }}
                    </NButton>
                  ) : null}
                </NButtonGroup>
              </div>
            </div>
            <NSpin show={loading.value}>
              {videos.value.count ? (
                <>
                  <div class="video-list mar-b-4-item">
                    <NGrid cols="2 s:3 m:4 xl:6" xGap={10} yGap={10} responsive="screen">
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
                      onUpdatePage={page => {
                        router.push({ name: "search", query: { ...route.query, page } });
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
        ) : (
          <NSpace class="text-center" justify="center">
            {searchHistorys.value.map(keywords => (
              <NButton
                key={keywords}
                round
                onClick={() => {
                  router.push({ name: "search", query: { ...route.query, page: 1, keywords } });
                }}
              >
                {keywords}
              </NButton>
            ))}
          </NSpace>
        )}
      </>
    );
  },
});
