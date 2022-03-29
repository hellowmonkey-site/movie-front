import VideoItem from "@/component/VideoItem";
import { deletePlayHistory, getPlayHistory, playHistorys } from "@/service/history";
import { NButton, NEmpty, NGrid, NGridItem, NTimeline, NTimelineItem, useDialog } from "naive-ui";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const router = useRouter();
    const dialog = useDialog();

    onMounted(() => {
      getPlayHistory();
    });

    return () => (
      <div class="d-flex direction-column">
        {playHistorys.value.length ? (
          <div class="d-flex justify-end mar-b-5-item">
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
          </div>
        ) : null}
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
