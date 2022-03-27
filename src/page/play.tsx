import { IVideo } from "@/service/video";
import { defineComponent, onMounted, ref } from "vue";
import Player from "xgplayer";
import HlsJsPlayer from "xgplayer-hls.js";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    let videoPlayer: any;
    const video = ref<IVideo | null>(null);

    function createPlayer(sourceUrl = "") {
      if (!video.value) {
        return;
      }
      const options = {
        id: "xg",
        autoplay: true,
        url: sourceUrl,
        // height: window.innerHeight - 70 - 70,
        fitVideoSize: "fixHeight",
        fluid: true,
        poster: video.value.cover,
        playbackRate: [0.5, 1, 1.5, 2, 3],
        defaultPlaybackRate: 1,
        // download: true
      };
      if (String(sourceUrl).indexOf(".m3u8") !== -1) {
        videoPlayer = new HlsJsPlayer(options);
      } else {
        videoPlayer = new Player(options);
      }
    }

    onMounted(() => {
      return () => {
        videoPlayer?.destroy();
      };
    });

    return () => <div>play</div>;
  },
});
