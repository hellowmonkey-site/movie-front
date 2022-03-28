import { IPlay, IPlayListGroup } from "@/service/playlist";
import { NButton, NSpace, NTabPane, NTabs } from "naive-ui";
import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";

export default defineComponent({
  props: {
    playlist: {
      type: Array as PropType<IPlay[]>,
      default: undefined,
    },
    playId: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  emits: ["click"],
  setup: (props, ctx) => {
    const activeTab = ref(0);
    const playlist = computed(() => {
      const list = Array.from(props.playlist || []);
      const data: IPlayListGroup[] = [...new Set(list.map(v => v.circuit_name))].map(circuit_name => {
        const { circuit_id } = list.find(v => v.circuit_name === circuit_name)!;
        return {
          circuit_name,
          circuit_id,
          list: list.filter(v => v.circuit_name === circuit_name),
        };
      });
      return data;
    });
    const play = computed(() => {
      let play: IPlay | undefined;
      if (props.playId) {
        play = Array.from(props.playlist || []).find(v => v.id === Number(props.playId));
      } else {
        play = Array.from(props.playlist || [])[0];
      }
      return play;
    });

    function setActiveTab() {
      if (play.value) {
        activeTab.value = play.value.circuit_id;
      }
    }

    watch(play, setActiveTab);

    onMounted(setActiveTab);

    return () => (
      <NTabs type="card" size="large" v-model={[activeTab.value, "value"]}>
        {playlist.value.map(item => (
          <NTabPane tab={item.circuit_name} name={item.circuit_id}>
            <NSpace>
              {item.list.map(v => (
                <NButton size="large" onClick={() => ctx.emit("click", v)} type={Number(props.playId) === v.id ? "primary" : "default"}>
                  {v.title}
                </NButton>
              ))}
            </NSpace>
          </NTabPane>
        ))}
      </NTabs>
    );
  },
});
