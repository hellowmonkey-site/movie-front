import router from "@/router";
import { defaultRoute, getRouterDetail, IRoute, postRouter, putRouter } from "@/service/route";
import { Button, Form, FormItem, Input, Modal, Switch } from "ant-design-vue";
import { computed, defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {},
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const form = reactive<IRoute>({
      ...defaultRoute,
    });
    const isAddPage = props.id === null;

    const handleSubmit = (params: IRoute) => {
      console.log(params);

      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}页面？`,
        onOk: () => {
          return (isAddPage ? postRouter({ ...params, parent_id: Number(route.query.parent_id || 0) }) : putRouter(form)).then(e => {
            router.back();
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getRouterDetail(props.id).then(data => {
          form.id = data.id;
          form.is_menu = data.is_menu;
          form.key = data.key;
          form.parent_id = data.parent_id;
          form.sort = data.sort;
          form.title = data.title;
          form.url = data.url;
        });
      }
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="title" label="标题" rules={[{ required: true, message: "请先输入标题" }]}>
          <Input placeholder="请输入标题" v-model={[form.title, "value"]}></Input>
        </FormItem>
        <FormItem name="key" label="name" rules={[{ required: true, message: "请先输入name" }]}>
          <Input placeholder="请输入name" v-model={[form.key, "value"]}></Input>
        </FormItem>
        <FormItem name="url" label="链接地址">
          <Input placeholder="请输入链接地址" v-model={[form.url, "value"]}></Input>
        </FormItem>
        <FormItem name="is_menu" label="是不是菜单" rules={[{ required: true, message: "请先输入是不是菜单" }]}>
          <Switch v-model={[form.is_menu, "checked"]} checkedChildren="是" unCheckedChildren="不是" unCheckedValue={0} checkedValue={1} />
        </FormItem>
        <FormItem name="sort" label="排序" rules={[{ required: true, message: "请先输入排序" }]}>
          <Input placeholder="请输入排序" type="number" v-model={[form.sort, "value"]}></Input>
        </FormItem>
        <div class="d-flex align-items-center justify-center">
          <Button htmlType="submit" type="primary" size="large">
            提交
          </Button>
        </div>
      </Form>
    );
  },
});
