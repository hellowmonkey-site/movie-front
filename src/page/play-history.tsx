import VideoItem from "@/component/VideoItem";
import { pullDownRefresh } from "@/service/plus";
import { deletePlayHistory, getPlayHistory, playHistorys } from "@/service/history";
import { user } from "@/service/user";
import { NButton, NEmpty, NGrid, NGridItem, NTimeline, NTimelineItem, useDialog } from "naive-ui";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dialog = useDialog();
    const refresh = pullDownRefresh(fetchData);

    function fetchData() {
      getPlayHistory().finally(() => {
        refresh?.end();
      });
    }

    onMounted(fetchData);

    return () => (
      <div class="d-flex direction-column">
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
        {playHistorys.value.length ? (
          <NTimeline size="large">
            {playHistorys.value.map(item => (
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
      </div>
    );
  },
});
