import { TableColumnType } from "@/config/type";
import { Input, Table } from "ant-design-vue";
import { defineComponent, onMounted, PropType, reactive, ref } from "vue";

interface IFetchParams {
  keywords?: string | null;
  page: number;
}

export default defineComponent({
  props: {
    fetchData: {
      type: Function as PropType<(params: IFetchParams) => Promise<any>>,
      default: undefined,
    },
    columns: {
      type: Array as PropType<TableColumnType[]>,
      default: undefined,
    },
    showProp: {
      type: String as PropType<string>,
      default: "title",
    },
  },
  emits: ["change"],
  setup: (props, ctx) => {
    const loading = ref(false);
    const visible = ref(false);
    const form = reactive<IFetchParams>({
      keywords: null,
      page: 1,
    });
    const activeText = ref<string>("");

    const dataSource = ref([]);
    let visibleTimer: number;
    let inputTimer: number;

    function onInputFocus() {
      visible.value = true;
      fetchData();
    }

    function onInputBlur() {
      visibleTimer = setTimeout(() => {
        visible.value = false;
        form.keywords = null;
      }, 200);
    }

    function onInput({ value }: HTMLInputElement) {
      form.keywords = value;
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        fetchData();
      }, 300);
    }

    // 选择
    function onRowClick(params: any) {
      ctx.emit("change", params);
      form.keywords = null;
      activeText.value = params[props.showProp];
      clearTimeout(visibleTimer);
      visible.value = false;
    }

    function fetchData() {
      if (!props.fetchData) {
        return;
      }
      visible.value = true;
      loading.value = true;
      props
        .fetchData(form)
        .then(data => {
          dataSource.value = data;
        })
        .finally(() => {
          loading.value = false;
        });
    }

    onMounted(() => {
      document.addEventListener("click", () => {
        clearTimeout(visibleTimer);
        visible.value = false;
        form.keywords = null;
      });
      return () => {
        clearTimeout(visibleTimer);
      };
    });

    return () => (
      <div class="select-table pos-rel">
        <div onClick={e => e.stopPropagation()}>
          <Input
            placeholder="请输入"
            value={form.keywords === null ? activeText.value : form.keywords}
            onInput={e => onInput(e.target)}
            onFocus={() => onInputFocus()}
            onBlur={() => onInputBlur()}
          />
        </div>
        {visible.value ? (
          <div
            class="select-table-dropdown"
            onClick={e => {
              e.stopPropagation();
              clearTimeout(visibleTimer);
            }}
          >
            <Table
              columns={props.columns}
              pagination={{
                pageSize: 1,
                showSizeChanger: true,
                onChange(e) {
                  console.log(e);
                },
              }}
              scroll={{ y: 400 }}
              onRowClick={e => {
                onRowClick(e);
              }}
              size="small"
              dataSource={dataSource.value}
              loading={loading.value}
            />
          </div>
        ) : null}
      </div>
    );
  },
});
