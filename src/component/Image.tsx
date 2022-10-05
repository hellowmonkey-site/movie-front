import { getFullUrl } from "@/helper";
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { NSpin } from "naive-ui";
import config from "@/config";
import { imagePreview } from "@/helper/viewer";
import { plusImagePreview } from "@/service/plus";
const FailImg = getFullUrl(config.baseURL, config.imageUrl, "image-fail.png");

const enum ImgStatus {
  EMPTY,
  LOADING,
  LOADED,
  ERROR,
}

export default defineComponent({
  props: {
    src: {
      type: String as PropType<string>,
      default: "",
    },
    preview: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  emits: ["load", "error"],
  setup: (props, ctx) => {
    const imgStatus = ref<ImgStatus>(ImgStatus.EMPTY);
    const src = ref("");
    const proxyUrl = getFullUrl(config.baseURL, "proxy/image");

    function loadImage() {
      if (props.src) {
        const img = new Image();
        img.src = getFullUrl(config.baseURL, props.src);
        imgStatus.value = ImgStatus.LOADING;
        img.onload = () => {
          imgStatus.value = ImgStatus.LOADED;
          src.value = img.src;
          ctx.emit("load");
        };
        img.onerror = () => {
          if (img.src.includes(proxyUrl)) {
            imgStatus.value = ImgStatus.ERROR;
            ctx.emit("error");
          } else {
            img.src = `${proxyUrl}?url=${img.src}`;
          }
        };
      }
    }

    watch(props, () => {
      src.value = "";
      loadImage();
    });

    onMounted(loadImage);

    return () => (
      <>
        {imgStatus.value === ImgStatus.LOADING ? (
          <div class="d-flex align-items-center justify-center full-height">
            <NSpin />
          </div>
        ) : imgStatus.value === ImgStatus.LOADED ? (
          <img
            src={src.value}
            onClick={() => {
              if (props.preview) {
                if (config.isApp) {
                  plusImagePreview(src.value);
                } else {
                  imagePreview(src.value);
                }
              }
            }}
            alt={props.preview ? "点击预览" : ""}
            class={["full-width full-height object-cover", props.preview ? "cursor-pointer" : ""]}
          />
        ) : imgStatus.value === ImgStatus.ERROR ? (
          <img src={FailImg} data-origin-src={props.src} />
        ) : null}
      </>
    );
  },
});
