import Image from "@/component/Image";
import PlayList from "@/component/PlayList";
import RecommendList from "@/component/RecommendList";
import config from "@/config";
import { PlusOpenTypes, plusPlayURL } from "@/helper/plus";
import { appConfig, menuCollapsed, setAppConfig } from "@/service/common";
import { ThemeTypes } from "@/service/common";
import { postPlayLog } from "@/service/history";
import { getInfoList, getRecommendByCategoryId, getVideoDetail, postReport, videoDetail } from "@/service/video";
import { appWindow } from "@tauri-apps/api/window";
import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@vicons/material";
import { NButton, NCollapseTransition, NIcon, NInput, useDialog } from "naive-ui";
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import Player, { IPlayerOptions } from "xgplayer";
import HlsJsPlayer from "xgplayer-hls.js";

export default defineComponent({
  props: {
    videoId: {
      type: Number as PropType<number>,
      default: null,
    },
    playId: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const dialog = useDialog();
    let videoPlayer: Player;
    const el = ref<HTMLElement | undefined>();
    const router = useRouter();
    const playId = ref(props.playId);
    const play = computed(() => {
      if (!videoDetail.value) {
        return null;
      }
      return videoDetail.value.playlist.find(v => v.id === Number(playId.value));
    });
    const infoList = computed(() => {
      return getInfoList(videoDetail.value);
    });

    const toggleCollapse = ref(false);

    const oldTheme = appConfig.value.themeType;
    const oldCollapsed = menuCollapsed.value;

    // const playNextUrls = computed(() => {
    //   if (!videoDetail.value || !play.value?.id) {
    //     return [];
    //   }
    //   const playlist = Array.from(videoDetail.value.playlist);
    //   const index = playlist.findIndex(v => v.id === Number(play.value?.id));
    //   return playlist.slice(index).map(v => v.src);
    // });

    function createPlayer() {
      if (!videoDetail.value) {
        return null;
      }
      if (!play.value) {
        return;
      }
      if (!el.value) {
        return;
      }
      videoPlayer?.destroy();
      const { offsetWidth, offsetHeight } = el.value;
      setTimeout(() => {
        const options: IPlayerOptions = {
          el: el.value,
          autoplay: appConfig.value.autoplay,
          url: play.value?.src || "",
          width: offsetWidth,
          height: appConfig.value.fitVideoSize === "fixWidth" ? offsetHeight : undefined,
          fitVideoSize: appConfig.value.fitVideoSize,
          // fluid: true,
          poster: videoDetail.value?.cover,
          playbackRate: config.playbackRates,
          defaultPlaybackRate: appConfig.value.playbackRate,
          pip: appConfig.value.pip,
          miniplayer: appConfig.value.miniplayer,
          enableContextmenu: false,
          lang: "zh-cn",
          volume: appConfig.value.volume / 100,
          // playNext: {
          //   urlList: playNextUrls.value,
          // },
          // download: true
        };
        if (String(options.url).indexOf(".m3u8") !== -1) {
          videoPlayer = new HlsJsPlayer(options);
        } else {
          videoPlayer = new Player(options);
        }

        // 视频加载完成做处理
        videoPlayer.once("complete", () => {
          if (videoDetail.value && play.value) {
            // 播放历史
            postPlayLog(videoDetail.value.id, play.value.id);
          }
        });
        videoPlayer.on("ended", e => {
          // 自动进入下一集
          if (appConfig.value.autoNext && videoDetail.value && play.value?.circuit_id) {
            const playlist = Array.from(videoDetail.value.playlist).filter(v => v.circuit_id === Number(play.value?.circuit_id));
            const index = playlist.findIndex(v => v.id === Number(play.value?.id));
            if (index < 0 || index >= playlist.length - 1) {
              return;
            }
            const { id: playId } = playlist[index + 1];
            router.replace({ name: "play", params: { videoId: props.videoId, playId } });
          }
        });
      }, 100);
    }

    function fetchData() {
      getVideoDetail(props.videoId).then(data => {
        createPlayer();
        // 推荐
        getRecommendByCategoryId(data.category_id);
      });
    }

    onBeforeRouteUpdate(to => {
      playId.value = Number(to.params.playId);
      createPlayer();
    });

    onMounted(async () => {
      setAppConfig({
        themeType: ThemeTypes.DARK,
      });
      if (config.isMsi) {
        await appWindow.setFullscreen(true);
      }
      menuCollapsed.value = true;
      fetchData();
    });

    onBeforeUnmount(() => {
      videoPlayer?.destroy();
      setAppConfig({
        themeType: oldTheme,
      });
      if (config.isMsi) {
        appWindow.setFullscreen(false).then(() => {
          menuCollapsed.value = oldCollapsed;
        });
      } else {
        menuCollapsed.value = oldCollapsed;
      }
    });

    return () => (
      <>
        <div class="video-player-container mar-b-5-item d-flex justify-center align-items-center">
          <div ref={el} class="video-player" />
        </div>
        <div class="mar-b-5">
          <div class="d-flex direction-column mar-b-3-item">
            <div class="d-flex justify-between align-items-start mar-b-3-item">
              <div class="d-flex align-items-start flex-item-extend justify-start mar-r-4-item">
                <h1 class="font-xlg mar-r-2-item">{videoDetail.value?.title}</h1>
                <div class="d-flex align-items-center flex-item-extend pad-t-1">
                  <span class="font-large font-bold mar-r-2-item font-gray">·</span>
                  <span class="space-nowrap">{play.value?.title}</span>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <NButton
                  size="small"
                  class="mar-r-2-item"
                  onClick={() => {
                    let remark = "无法播放";
                    dialog.warning({
                      title: "提交错误",
                      content() {
                        return <NInput type="textarea" placeholder="请输入错误内容" defaultValue={remark} onInput={v => (remark = v)} />;
                      },
                      positiveText: "确认提交",
                      onPositiveClick() {
                        if (!videoDetail.value || !remark) {
                          return;
                        }
                        return postReport(remark, videoDetail.value.id, play.value?.id);
                      },
                    });
                  }}
                >
                  纠错
                </NButton>
                <div class="d-flex align-items-center cursor-pointer" onClick={() => (toggleCollapse.value = !toggleCollapse.value)}>
                  <span class="font-gray mar-r-1-item font-small">简介</span>
                  <NIcon size={20}>{toggleCollapse.value ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}</NIcon>
                </div>
              </div>
            </div>
            {config.isApp && play.value?.src ? (
              <NButton
                block
                type="primary"
                onClick={() => {
                  plus.nativeUI.actionSheet(
                    {
                      title: "请选择打开方式",
                      cancel: "取消",
                      buttons: [
                        {
                          title: "原生应用打开",
                        },
                        {
                          title: "浏览器打开",
                        },
                      ],
                    },
                    ({ index }: { index: number }) => {
                      if (index <= 0) {
                        return;
                      }
                      let type = PlusOpenTypes.NATIVE;
                      if (index === 2) {
                        type = PlusOpenTypes.BROWSER;
                      }
                      videoPlayer?.destroy();
                      plusPlayURL(play.value?.src || "", type);
                    }
                  );
                }}
              >
                原生播放器观看
              </NButton>
            ) : null}
          </div>
          <NCollapseTransition show={toggleCollapse.value}>
            <div class="video-info video-info-small d-flex">
              <div class="video-cover">
                <Image src={videoDetail.value?.cover} />
              </div>
              <div class="flex-item-extend d-flex direction-column break-all">
                {infoList.value.map(info => (
                  <div class="mar-b-4-item d-flex" key={info.value}>
                    <span class="font-gray font-small mar-r-3">{info.text}</span>
                    <span class="flex-item-extend">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </NCollapseTransition>
        </div>
        <PlayList
          playId={play.value?.id}
          playlist={videoDetail.value?.playlist}
          onClick={({ id: playId }) => {
            router.replace({ name: "play", params: { videoId: props.videoId, playId } });
          }}
        />
        <RecommendList />
      </>
    );
  },
});
