import VideoItem from "@/component/VideoItem";
import { goTop } from "@/helper";
import { categorys } from "@/service/category";
import { videoLength } from "@/service/common";
import { getRandomVideoList, IVideo } from "@/service/video";
import { CircleOutlined, RefreshOutlined } from "@vicons/material";
import { NButton, NGrid, NGridItem, NH2, NIcon, NSpin, NText } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const loading = ref(false);
    const list = ref<IVideo[]>([]);
    const dataList = computed(() => {
      return list.value.slice(0, videoLength.value);
    });

    function fetchData() {
      loading.value = true;
      getRandomVideoList(Number(route.query.category))
        .then(data => {
          goTop();
          list.value = data;
        })
        .finally(() => {
          loading.value = false;
        });
    }

    onMounted(() => {
      fetchData();
    });

    return () => (
      <>
        <NH2 prefix="bar" class="mar-0 mar-b-3-item">
          <NText>{categorys.value.find(v => v.id === Number(route.query.category))?.name || "相关推荐"}</NText>
        </NH2>
        <NButton type="primary" circle onClick={fetchData} class="refresh-fixed" size="large">
          <NIcon size={24}>
            <RefreshOutlined />
          </NIcon>
        </NButton>
        <NSpin show={loading.value}>
          <div class="video-list mar-b-3-item">
            <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={10} yGap={10} responsive="screen">
              {dataList.value.map(item => {
                return (
                  <NGridItem key={item.id}>
                    <VideoItem video={item}></VideoItem>
                  </NGridItem>
                );
              })}
            </NGrid>
          </div>
        </NSpin>
      </>
    );
  },
});
