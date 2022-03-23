import router from "@/router";
import { defaultRole, getRoleDetail, IRole, postRole, putRole } from "@/service/role";
import { Button, Form, FormItem, Input, Modal } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<IRole>({
      ...defaultRole,
    });
    const isAddPage = props.id === null;

    const handleSubmit = (params: IRole) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}角色？`,
        onOk: () => {
          return (isAddPage ? postRole({ ...params }) : putRole(form)).then(e => {
            router.back();
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getRoleDetail(props.id).then(data => {
          form.id = data.id;
          form.name = data.name;
          form.home_url = data.home_url;
        });
      }
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="角色名称" rules={[{ required: true, message: "请先输入角色名称" }]}>
          <Input placeholder="请输入角色名称" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="home_url" label="首页地址">
          <Input placeholder="请输入首页地址" v-model={[form.home_url, "value"]}></Input>
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
