import PlayList from "@/component/PlayList";
import { menuCollapsed } from "@/service/common";
import { changeThemeType, themeType, ThemeTypes } from "@/service/theme";
import { getVideoDetail, videoDetail } from "@/service/video";
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

    const oldTheme = themeType.value;
    const oldCollapsed = menuCollapsed.value;

    function createPlayer() {
      if (!videoDetail.value) {
        return null;
      }
      if (!play.value) {
        return;
      }
      videoPlayer?.destroy();
      setTimeout(() => {
        const options: IPlayerOptions = {
          el: el.value,
          autoplay: true,
          url: play.value?.src || "",
          width: "90%",
          height: "calc(100vh - 200px)",
          fitVideoSize: "fixWidth",
          // fluid: true,
          poster: videoDetail.value?.cover,
          playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
          defaultPlaybackRate: 1,
          pip: true,
          // miniplayer: true,
          enableContextmenu: true,
          // download: true
        };
        if (String(options.url).indexOf(".m3u8") !== -1) {
          videoPlayer = new HlsJsPlayer(options);
        } else {
          videoPlayer = new Player(options);
        }
      }, 100);
    }

    function fetchData() {
      getVideoDetail(props.videoId).then(() => {
        createPlayer();
      });
    }

    onBeforeRouteUpdate(to => {
      playId.value = Number(to.params.playId);
      createPlayer();
    });

    onMounted(() => {
      createPlayer();
      fetchData();

      changeThemeType(ThemeTypes.DARK);
      menuCollapsed.value = true;
    });

    onBeforeUnmount(() => {
      videoPlayer?.destroy();
      changeThemeType(oldTheme);
      menuCollapsed.value = oldCollapsed;
    });

    return () => (
      <>
        <div class="video-player mar-b-5-item d-flex justify-center align-items-center">
          <div ref={el} />
        </div>
        <div class="d-flex align-items-center mar-b-5">
          <h1 class="font-xlg mar-r-2-item">{videoDetail.value?.title}</h1>
          <span class="font-large font-bold mar-r-2-item font-gray">·</span>
          <span>{play.value?.title}</span>
        </div>
        <PlayList
          playId={play.value?.id}
          playlist={videoDetail.value?.playlist}
          onClick={({ id: playId }) => {
            router.replace({ name: "play", params: { videoId: props.videoId, playId } });
          }}
        />
      </>
    );
  },
});
