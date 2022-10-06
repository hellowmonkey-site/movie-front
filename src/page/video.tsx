import Description from "@/component/Description";
import Image from "@/component/Image";
import PlayList from "@/component/PlayList";
import RecommendList from "@/component/RecommendList";
import { collectVideoList, postCancelCollect, postCollect } from "@/service/collect";
import { isMobileWidth, setTitle } from "@/service/common";
import { playHistoryIds } from "@/service/history";
import { user } from "@/service/user";
import { fullVideoList, getInfoList, getRecommendVideoList, getVideoDetail, IVideoItem } from "@/service/video";
import { FavoriteOutlined, FavoriteTwotone } from "@vicons/material";
import { NButton, NSkeleton, NSpin } from "naive-ui";
import { computed, defineComponent, onMounted, PropType, ref, Teleport } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";

export default defineComponent({
  props: {
    videoId: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    let videoId = Number(props.videoId);
    const router = useRouter();
    const infoList = computed(() => {
      return getInfoList(videoDetail.value);
    });
    const loading = ref(false);
    const recommendLoading = ref(false);

    const videoDetail = ref<IVideoItem>();
    const playId = computed(() => {
      const playlist = Array.from(videoDetail.value?.playlist || []);
      const play = playlist.find(v => playHistoryIds.value.includes(v.id));
      if (play) {
        return play.id;
      }
      return playlist[0]?.id;
    });

    function fetchData() {
      videoDetail.value = fullVideoList.value.find(v => v.id === videoId);
      if (videoDetail.value) {
        setTitle(videoDetail.value!.title);
      }
      loading.value = true;
      getVideoDetail(videoId)
        .then(data => {
          videoDetail.value = data;
          setTitle(videoDetail.value!.title);
        })
        .finally(() => {
          loading.value = false;
        });

      // 推荐
      recommendLoading.value = true;
      getRecommendVideoList(videoId).finally(() => {
        recommendLoading.value = false;
      });
    }

    onMounted(() => {
      fetchData();
    });

    onBeforeRouteUpdate(to => {
      videoId = Number(to.params.videoId);
      fetchData();
    });

    return () => (
      <>
        <div class="video-info d-flex mar-b-5-item">
          <div class="video-cover">
            {!loading.value || videoDetail.value?.cover ? (
              <Image src={videoDetail.value?.cover} />
            ) : (
              <NSkeleton height={isMobileWidth.value ? "260px" : "400px"}></NSkeleton>
            )}
          </div>
          <div class="flex-item-extend d-flex direction-column break-all">
            <div class="d-flex align-items-center justify-between mar-b-5-item">
              {!loading.value || videoDetail.value?.title ? (
                <>
                  <h1 class="font-xlg mar-r-3-item">{videoDetail.value?.title}</h1>
                  {user.value.id ? (
                    collectVideoList.value.some(v => v.id === videoId) ? (
                      <NButton size="small" type="error" onClick={() => postCancelCollect(videoId)} ghost>
                        {{
                          default: () => "取消收藏",
                          icon: () => <FavoriteTwotone />,
                        }}
                      </NButton>
                    ) : (
                      <NButton size="small" onClick={() => postCollect(videoId)}>
                        {{
                          default: () => "收藏",
                          icon: () => <FavoriteOutlined />,
                        }}
                      </NButton>
                    )
                  ) : null}
                </>
              ) : (
                <NSkeleton height="30px"></NSkeleton>
              )}
            </div>
            {!loading.value || infoList.value.length ? (
              <>
                {infoList.value.map(info => (
                  <div class="mar-b-4-item d-flex" key={info.value}>
                    <span class="font-gray font-small mar-r-3">{info.text}</span>
                    <span class="flex-item-extend">{info.value}</span>
                  </div>
                ))}
                {videoDetail.value?.description ? (
                  <div class="mar-b-5-item d-flex">
                    <span class="font-gray font-small mar-r-3">简介</span>
                    <span class="flex-item-extend">
                      <Description text={videoDetail.value.description} />
                    </span>
                  </div>
                ) : null}
                {playId.value ? (
                  <div class="d-flex align-items-center justify-center">
                    <NButton
                      size="large"
                      type="primary"
                      onClick={() => {
                        router.push({ name: "play", params: { videoId, playId: playId.value } });
                      }}
                    >
                      立即播放
                    </NButton>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {new Array(5).fill(1).map((v, i) => (
                  <NSkeleton height="20px" text class="mar-b-3-item" key={i}></NSkeleton>
                ))}
                <NSkeleton height="100px" text></NSkeleton>
              </>
            )}
          </div>
        </div>
        {!loading.value || videoDetail.value?.playlist ? (
          <PlayList
            playlist={videoDetail.value?.playlist}
            onClick={({ id: playId }) => router.push({ name: "play", params: { videoId, playId } })}
          />
        ) : (
          <div class="mar-t-6">
            <NSkeleton height="50px" text class="mar-b-3-item"></NSkeleton>
            <NSkeleton height="50px" text class="mar-b-3-item"></NSkeleton>
            <NSkeleton height="50px" text class="mar-b-3-item"></NSkeleton>
          </div>
        )}
        <div class="mar-t-4">
          {recommendLoading.value ? (
            <div class="d-flex align-items-center justify-center" style="height: 300px">
              <NSpin />
            </div>
          ) : (
            <RecommendList videoId={videoId} />
          )}
        </div>
      </>
    );
  },
});
