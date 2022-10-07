import { pullDownRefresh } from "@/service/plus";
import { deleteSearchHistory, getSearchHistory, searchHistorys } from "@/service/history";
import { user } from "@/service/user";
import { NButton, NEmpty, NSpace } from "naive-ui";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { dialog } from "@/service/common";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const router = useRouter();
    const refresh = pullDownRefresh(fetchData);

    function fetchData() {
      getSearchHistory().finally(() => {
        refresh?.end();
      });
    }

    onMounted(getSearchHistory);

    return () => (
      <div class="d-flex direction-column">
        <div class="d-flex align-items-center justify-between mar-b-5-item">
          <span class="font-gray">{user.value.username}</span>
          {searchHistorys.value.length ? (
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
          ) : null}
        </div>
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
