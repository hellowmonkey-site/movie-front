import { IUserForm, postLogin } from "@/service/user";
import { NButton, NInput, useMessage } from "naive-ui";
import { defineComponent, reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const message = useMessage();
    const form = reactive<IUserForm>({
      username: "",
      password: "",
    });
    const loading = ref(false);
    const router = useRouter();

    function handleSubmit() {
      if (!form.username || !form.password) {
        return message.error("请先输入用户名和密码");
      }
      loading.value = true;
      postLogin(form)
        .then(() => {
          router.replace("/");
        })
        .finally(() => {
          loading.value = false;
        });
    }

    return () => (
      <div class="d-flex align-items-center justify-center full-height-vh login-page">
        <div class="login-box">
          <div class="font-large text-center mar-b-6-item">登录</div>
          <div class="d-flex align-items-center justify-between mar-b-5-item">
            <div class="label">用户名</div>
            <NInput placeholder="请输入用户名" v-model={[form.username, "value"]} class="flex-item-extend" />
          </div>
          <div class="d-flex align-items-center justify-between mar-b-5-item">
            <div class="label">密码</div>
            <NInput type="password" placeholder="请输入密码" v-model={[form.password, "value"]} class="flex-item-extend" />
          </div>
          <div class="d-flex justify-center align-items-center pos-rel">
            <RouterLink to={{ name: "index" }} class="font-small font-gray pos-abs pos-r-0">
              返回首页
            </RouterLink>
            <NButton size="large" type="primary" onClick={handleSubmit} loading={loading.value}>
              登录
            </NButton>
          </div>
        </div>
      </div>
    );
  },
});
