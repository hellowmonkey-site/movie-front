import { StorageType } from "@/config/type";
import { imagePreview } from "@/helper/viewer";
import { uploadImage } from "@/service/common";
import { DeleteOutlined, EyeOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { message, Tooltip } from "ant-design-vue";
import { computed, defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    images: {
      type: Array as PropType<StorageType[]>,
      default: undefined,
    },
    maxCount: {
      type: Number as PropType<number>,
      default: undefined,
    },
    accept: {
      type: String as PropType<string>,
      default: "image/*",
    },
    text: {
      type: String as PropType<string>,
      default: "上传图片",
    },
  },
  emits: ["change"],
  setup(props, ctx) {
    const loading = ref(false);
    const fileRef = ref<HTMLElement | null>(null);

    const images = computed(() => {
      return (props.images || []).filter(v => v.path);
    });
    const remainNum = computed(() => {
      return props.maxCount ? props.maxCount - images.value.length : null;
    });

    // 删除
    function handleRemove(item: StorageType) {
      ctx.emit(
        "change",
        images.value.filter(v => v.id !== item.id)
      );
    }

    // 上传
    function handleUpload({ files }: HTMLInputElement) {
      if (!files) {
        return;
      }
      let data = Array.from(files);
      if (remainNum.value && remainNum.value < files.length) {
        data = data.slice(0, remainNum.value);
        message.warning(`已去除${files.length - remainNum.value}张`);
      }
      loading.value = true;
      Promise.all(data.map(file => uploadImage(file)))
        .then(e => {
          ctx.emit("change", [...images.value, ...e]);
        })
        .finally(() => {
          loading.value = false;
        });
    }

    return () => (
      <div class="upload-image-list d-flex wrap">
        {images.value.map((item, index) => {
          return (
            <div class="upload-image-item">
              <div style={{ backgroundImage: `url('${item.path}')` }} class="bg-cover full-height full-width d-flex align-items-stretch">
                <div class="upload-image-tool flex-item-extend d-flex align-items-center justify-center">
                  <Tooltip title="预览">
                    <EyeOutlined onClick={() => imagePreview(images.value, index)} class="mar-r-4-item" />
                  </Tooltip>
                  <Tooltip title="删除">
                    <DeleteOutlined onClick={() => handleRemove(item)} class="mar-r-4-item" />
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
        {loading.value ? (
          <div class="upload-image-item d-flex align-items-stretch justify-center">
            <div class="d-flex direction-column align-items-center justify-center flex-item-extend">
              <LoadingOutlined class="mar-b-3-item" />
              <span>正在上传...</span>
            </div>
          </div>
        ) : remainNum.value === null || remainNum.value > 0 ? (
          <div class="upload-image-item d-flex align-items-stretch justify-center upload-image-btn">
            <div class="d-flex direction-column align-items-center justify-center flex-item-extend" onClick={e => fileRef.value?.click()}>
              <PlusOutlined class="mar-b-3-item" />
              <div class="d-flex align-items-center">
                <span>{props.text}</span>
                {remainNum.value ? <span class="mar-l-1 font-gray font-mini">({remainNum.value}张)</span> : null}
              </div>
            </div>
          </div>
        ) : null}
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileRef}
          accept={props.accept}
          multiple={true}
          onChange={e => handleUpload(e.target as HTMLInputElement)}
        />
      </div>
    );
  },
});
