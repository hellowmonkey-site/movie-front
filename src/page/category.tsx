import VideoItem from "@/component/VideoItem";
import { categorys } from "@/service/category";
import { getRecommendVideoList, recommendVideoList } from "@/service/video";
import { NGrid, NGridItem, NH2, NResult, NSpin, NText } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();

    const title = computed(() => {
      const category = categorys.value.find(v => v.url === route.params.category);
      return category?.name;
    });
    const loading = ref(false);

    function fetchData() {
      loading.value = true;
      getRecommendVideoList().finally(() => {
        loading.value = false;
      });
    }

    onMounted(() => {
      fetchData();
    });

    onBeforeRouteUpdate(to => {
      fetchData();
    });

    return () => (
      <>
        <NH2 prefix="bar">
          <NText>{title.value}</NText>
        </NH2>
        <NSpin show={loading.value}>
          <div class="video-list">
            <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
              {recommendVideoList.value.map(item => {
                return (
                  <NGridItem>
                    <VideoItem video={item} tag="definition"></VideoItem>
                  </NGridItem>
                );
              })}
            </NGrid>
          </div>
        </NSpin>
        {!title.value ? (
          <div style={{ height: "70vh" }} class="d-flex direction-column justify-center">
            <NResult status="404" title="分类不存在" description="别瞎搞好吧..."></NResult>
          </div>
        ) : null}
      </>
    );
  },
});
