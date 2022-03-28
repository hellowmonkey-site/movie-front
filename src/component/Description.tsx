import { NButton } from "naive-ui";
import { computed, defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String as PropType<string>,
      default: undefined,
    },
    length: {
      type: Number as PropType<number>,
      default: 100,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const toggle = ref(false);
    const str = computed(() => {
      const str = String(props.text).slice(0, props.length);
      if (String(props?.text).length <= str.length) {
        return props.text;
      }
      if (toggle.value) {
        return props.text;
      }
      return `${str}...`;
    });
    return () => (
      <>
        {str.value}
        {!toggle.value && str?.value?.length !== props?.text?.length ? (
          <NButton
            type="primary"
            size="small"
            onClick={() => {
              toggle.value = true;
            }}
            class="mar-l-2"
            secondary
            strong
          >
            详情
          </NButton>
        ) : null}
      </>
    );
  },
});
