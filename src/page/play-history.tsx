import VideoItem from "@/component/VideoItem";
import { pullDownRefresh } from "@/service/plus";
import { deletePlayHistory, getPlayHistory, IPlayHistory, playHistorys } from "@/service/history";
import { user } from "@/service/user";
import { NButton, NEmpty, NGrid, NGridItem, NPagination, NSpin, NTimeline, NTimelineItem } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { defaultPageData, dialog, isMobileWidth } from "@/service/common";
import { PageData } from "@/config/type";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const pageSize = 3;
    const route = useRoute();
    const router = useRouter();
    const page = ref<number>(Number(route.query.page) || 1);
    const refresh = pullDownRefresh(() => {
      page.value = 1;
      fetchData();
    });
    const loading = ref(false);

    const pageData = computed<PageData<IPlayHistory>>(() => {
      const count = playHistorys.value.length;
      const offset = Math.max((page.value - 1) * pageSize, 0);
      const pageCount = Math.ceil(count / pageSize);
      const data = playHistorys.value.slice(offset, offset + pageSize);

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
      if (!playHistorys.value.length) {
        loading.value = true;
      }
      getPlayHistory().finally(() => {
        loading.value = false;
        refresh?.end();
      });
    }

    onMounted(fetchData);

    onBeforeRouteUpdate(to => {
      page.value = Number(to.query.page) || 1;
    });

    return () => (
      <div>
        <div class="d-flex direction-column mar-b-6-item">
          <div class="d-flex align-items-center justify-between mar-b-5-item">
            <span class="font-gray">{user.value.username}</span>
            {playHistorys.value.length ? (
              <NButton
                type="error"
                onClick={() => {
                  const d = dialog.warning({
                    title: "清除确认",
                    content: "确认要清除搜索记录？",
                    positiveText: "确认",
                    onPositiveClick: () => {
                      d.loading = true;
                      return deletePlayHistory().then(() => {
                        getPlayHistory();
                      });
                    },
                  });
                }}
              >
                清除记录
              </NButton>
            ) : null}
          </div>
          <NSpin show={loading.value}>
            {pageData.value.data.length ? (
              <NTimeline size="large">
                {pageData.value.data.map(item => (
                  <NTimelineItem key={item.datetime} time={item.datetime} type="success" lineType="dashed">
                    <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
                      {item.list.map(video => {
                        return (
                          <NGridItem key={video.id}>
                            <VideoItem video={video}></VideoItem>
                          </NGridItem>
                        );
                      })}
                    </NGrid>
                  </NTimelineItem>
                ))}
              </NTimeline>
            ) : (
              <div class="empty-box">
                <NEmpty description="暂无数据"></NEmpty>
              </div>
            )}
          </NSpin>
        </div>
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
