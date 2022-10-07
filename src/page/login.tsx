import config from "@/config";
import { getFullUrl } from "@/helper";
import { message } from "@/service/common";
import { IUserForm, postLogin } from "@/service/user";
import { NButton, NCard, NInput, NLayout } from "naive-ui";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const iptEl = ref<HTMLInputElement>();
    const form = reactive<IUserForm>({
      username: "",
      password: "",
    });
    const loading = ref(false);
    const router = useRouter();

    function handleSubmit(e: Event) {
      e.preventDefault();
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

    onMounted(() => {
      iptEl.value?.focus();
    });

    return () => (
      <NLayout class="d-flex align-items-center justify-center full-height-vh login-page">
        <div class="d-flex direction-column align-items-center justify-center login-box">
          <NCard class="login-card">
            <div class="logo-box">
              <img src={getFullUrl(config.baseURL, config.imageUrl, "logo.png")} class="logo-img object-cover" />
            </div>
            <div class="font-large text-center mar-b-6-item">
              <span>登录</span>
              <span class="font-large mar-l-3 mar-r-3 font-bold">·</span>
              <span>{config.title}</span>
            </div>
            <form action="" onSubmit={handleSubmit}>
              <div class="d-flex align-items-center justify-between mar-b-5-item">
                <div class="label">用户名</div>
                <NInput placeholder="请输入用户名" ref={iptEl} v-model={[form.username, "value"]} class="flex-item-extend" />
              </div>
              <div class="d-flex align-items-center justify-between mar-b-5-item">
                <div class="label">密码</div>
                <NInput type="password" placeholder="请输入密码" v-model={[form.password, "value"]} class="flex-item-extend" />
              </div>
              <div class="d-flex justify-center align-items-center pos-rel">
                <RouterLink to={{ name: "index" }} class="font-small font-gray pos-abs pos-r-0">
                  返回首页
                </RouterLink>
                <NButton size="large" type="primary" loading={loading.value} attrType="submit">
                  登录
                </NButton>
              </div>
            </form>
          </NCard>
        </div>
      </NLayout>
    );
  },
});
