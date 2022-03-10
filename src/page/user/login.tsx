import { EyeOutlined, UserOutlined } from "@ant-design/icons-vue";
import { Button, Card, Checkbox, Form, FormItem, Input, InputPassword } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import Logo from "@/static/image/logo.png";
import { loading } from "@/service/common";
import router from "@/router";
import { postLogin } from "@/service/user";

interface IForm {
  username: string;
  password: string;
}

export default defineComponent({
  components: {},
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<IForm>({
      username: "",
      password: "",
    });

    const handleSubmit = (params: IForm) => {
      const hide = loading();
      postLogin(params)
        .then(() => {
          router.replace("/");
        })
        .finally(() => {
          hide();
        });
    };

    return () => (
      <div class="login-page d-flex direction-column align-items-center justify-center">
        <div class="d-flex align-items-center justify-center mar-b-2">
          <img src={Logo} alt="logo" class="logo" />
        </div>
        <Card title="登录">
          <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
            <FormItem name="username" rules={[{ required: true, message: "请先输入用户名" }]}>
              <Input placeholder="请输入用户名" v-model={[form.username, "value"]} size="large">
                {{
                  prefix: () => <UserOutlined />,
                }}
              </Input>
            </FormItem>
            <FormItem name="password" rules={[{ required: true, message: "请先输入密码" }]}>
              <InputPassword placeholder="请输入密码" v-model={[form.password, "value"]} size="large">
                {{
                  prefix: () => <EyeOutlined />,
                }}
              </InputPassword>
            </FormItem>
            <div class="d-flex justify-between align-items-center">
              <Checkbox>记住我</Checkbox>
              <Button type="primary" size="large" shape="round" htmlType="submit">
                确认登录
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  },
});
