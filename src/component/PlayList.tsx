import { playHistoryIds } from "@/service/history";
import { IPlay, IPlayListGroup } from "@/service/playlist";
import { NButton, NGrid, NGridItem, NSpace, NTabPane, NTabs } from "naive-ui";
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
        {playlist.value.map(item => {
          return (
            <NTabPane tab={item.circuit_name} name={item.circuit_id} key={item.circuit_id}>
              <NGrid cols="2 s:3 m:6 l:8 xl:12" xGap={10} yGap={10} responsive="screen">
                {item.list.map(v => {
                  const seed = playHistoryIds.value.includes(v.id);
                  return (
                    <NGridItem key={v.id}>
                      <NButton
                        size="large"
                        block
                        onClick={() => ctx.emit("click", v)}
                        type={Number(props.playId) === v.id || seed ? "primary" : "default"}
                        ghost={seed}
                      >
                        {v.title}
                      </NButton>
                    </NGridItem>
                  );
                })}
              </NGrid>
            </NTabPane>
          );
        })}
      </NTabs>
    );
  },
});
