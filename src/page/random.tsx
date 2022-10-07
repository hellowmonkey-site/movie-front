import VideoItem from "@/component/VideoItem";
import { goTop } from "@/helper";
import { categorys } from "@/service/category";
import { isShowBackTop, videoLength } from "@/service/common";
import { pullDownRefresh } from "@/service/plus";
import { getRandomVideoList, randomVideoList } from "@/service/video";
import { RefreshOutlined } from "@vicons/material";
import { NButton, NEmpty, NGrid, NGridItem, NH2, NIcon, NSpin, NText } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const refresh = pullDownRefresh(() => {
      fetchData();
    });
    const route = useRoute();
    const loading = ref(false);
    const dataList = computed(() => {
      return randomVideoList.value.slice(0, videoLength.value);
    });
    const categoryId = computed(() => Number(route.query.category));

    function fetchData() {
      loading.value = true;
      getRandomVideoList(categoryId.value)
        .then(() => {
          goTop();
        })
        .finally(() => {
          loading.value = false;
          refresh?.end();
        });
    }

    onMounted(() => {
      if (randomVideoList.value[0]?.category_id === categoryId.value) {
        return;
      }
      fetchData();
    });

    return () => (
      <>
        <NH2 prefix="bar" class="mar-0 mar-b-3-item">
          <NText>{categorys.value.find(v => v.id === categoryId.value)?.name || "相关推荐"}</NText>
        </NH2>
        <NButton
          type="primary"
          circle
          onClick={fetchData}
          class={["refresh-fixed ani", isShowBackTop.value ? "has-backtop" : null, loading.value ? "ani-loading" : null]}
          size="large"
        >
          <NIcon size={24}>
            <RefreshOutlined />
          </NIcon>
        </NButton>
        <NSpin show={loading.value}>
          {dataList.value.length ? (
            <div class="video-list mar-b-3-item">
              <NGrid cols="2 s:3 m:4 xl:6" xGap={10} yGap={10} responsive="screen">
                {dataList.value.map(item => {
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
      </>
    );
  },
});
