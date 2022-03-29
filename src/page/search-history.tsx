import { deleteSearchHistory, getSearchHistory, searchHistorys } from "@/service/history";
import { NButton, NEmpty, NSpace, useDialog } from "naive-ui";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const router = useRouter();
    const dialog = useDialog();

    onMounted(() => {
      getSearchHistory();
    });

    return () => (
      <div class="d-flex direction-column">
        {searchHistorys.value.length ? (
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
                    return deleteSearchHistory().then(() => {
                      getSearchHistory();
                    });
                  },
                });
              }}
            >
              清除记录
            </NButton>
          </div>
        ) : null}
        {searchHistorys.value.length ? (
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
        ) : (
          <div class="empty-box">
            <NEmpty description="暂无数据"></NEmpty>
          </div>
        )}
      </div>
    );
  },
});
