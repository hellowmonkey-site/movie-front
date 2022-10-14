import VideoItem from "@/component/VideoItem";
import { PageData } from "@/config/type";
import { collectVideoList, getCollectList } from "@/service/collect";
import { defaultPageData, isMobileWidth } from "@/service/common";
import { pullDownRefresh } from "@/service/plus";
import { IVideo } from "@/service/video";
import { NEmpty, NGrid, NGridItem, NH2, NPagination, NSpin, NText } from "naive-ui";
import { computed, defineComponent, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const pageSize = 20;
    const route = useRoute();
    const router = useRouter();
    const page = ref<number>(Number(route.query.page) || 1);
    const refresh = pullDownRefresh(() => {
      page.value = 1;
      fetchData();
    });
    const loading = ref(false);

    const pageData = computed<PageData<IVideo>>(() => {
      const count = collectVideoList.value.length;
      const offset = Math.max((page.value - 1) * pageSize, 0);
      const pageCount = Math.ceil(count / pageSize);
      const data = collectVideoList.value.slice(offset, offset + pageSize);

      return {
        ...defaultPageData,
        count,
        data,
        page: page.value,
        pageCount,
        pageSize,
      };
    });

    function fetchData() {
      if (!collectVideoList.value.length) {
        loading.value = true;
      }
      getCollectList().finally(() => {
        loading.value = false;
        refresh?.end();
      });
    }

    onBeforeRouteUpdate(to => {
      page.value = Number(to.query.page) || 1;
    });

    return () => (
      <div class="pad-3">
        <NH2 prefix="bar" class="mar-0 mar-b-3-item">
          <NText>我的收藏</NText>
        </NH2>
        <NSpin show={loading.value}>
          {collectVideoList.value.length ? (
            <div class="video-list mar-b-3-item">
              <NGrid cols="2 s:3 m:4 xl:6" xGap={10} yGap={10} responsive="screen">
                {pageData.value.data.map(item => {
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
        </NSpin>
        <div class="d-flex justify-center mar-b-3">
          <NPagination
            page={pageData.value.page}
            pageCount={pageData.value.pageCount}
            pageSize={pageData.value.pageSize}
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
      </div>
    );
  },
});
