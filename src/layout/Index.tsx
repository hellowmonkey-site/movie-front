import { isIE } from "@/helper/validate";
import { categorys } from "@/service/category";
import { setDialog, setNotification } from "@/service/common";
import { changeThemeType, themeTypes } from "@/service/theme";
import {
  MenuOption,
  NButton,
  NDropdown,
  NIcon,
  NInput,
  NInputGroup,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NTooltip,
  useDialog,
  useNotification,
} from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { HomeFilled, MovieFilterFilled, SettingsFilled, WbSunnyFilled } from "@vicons/material";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();

    const notification = useNotification();
    const dialog = useDialog();
    setNotification(notification);
    setDialog(dialog);

    const collapsed = ref(false);

    const selectedMenu = computed(() => {
      if (route.name === "index") {
        return "index";
      }
      if (route.name === "category") {
        return String(route.params.category) || null;
      }
      return null;
    });

    const menus = computed<MenuOption[]>(() => {
      const home: MenuOption = {
        label() {
          return <RouterLink to={{ name: "index" }}>首页</RouterLink>;
        },
        key: "index",
        icon() {
          return (
            <NIcon>
              <HomeFilled />
            </NIcon>
          );
        },
      };
      const list = categorys.value
        .filter(v => v.parent_id === 0)
        .map(item => {
          const children = categorys.value
            .filter(v => v.parent_id === item.id)
            .map(v => {
              return {
                label() {
                  return <RouterLink to={{ name: "category", params: { category: v.url } }}>{v.name}</RouterLink>;
                },
                key: v.url,
              };
            });
          return {
            label() {
              return children.length && item.url ? (
                String(item.name)
              ) : (
                <RouterLink to={{ name: "category", params: { category: item.url } }}>{item.name}</RouterLink>
              );
            },
            key: item.url,
            children: children.length
              ? [
                  {
                    label() {
                      return <RouterLink to={{ name: "category", params: { category: item.url } }}>全部</RouterLink>;
                    },
                    key: item.url,
                  },
                  ...children,
                ]
              : undefined,
            icon() {
              return (
                <NIcon>
                  <MovieFilterFilled />
                </NIcon>
              );
            },
          };
        });
      return [home, ...list];
    });

    // 默认打开菜单
    const defaultExpandedKeys = computed(() => {
      const selected = selectedMenu.value;
      if (!selected) {
        return [];
      }
      const data = menus.value.find(item => item.children?.length && item.children.some(v => v.key === selected));
      return data?.key ? [data.key] : [];
    });

    onMounted(() => {
      // 判断是不是IE浏览器
      if (isIE) {
        dialog.warning({
          title: "重要提示",
          content:
            "监测到您当前浏览器版本过低，会影响部分功能的使用，建议使用谷歌、火狐等高级浏览器，或将360等双核心的浏览器切换至极速模式",
          positiveText: "立即升级",
          maskClosable: false,
          onPositiveClick() {
            window.open("https://www.microsoft.com/zh-cn/edge");
            return Promise.reject({ message: "" });
          },
        });
      }
    });
    return () => (
      <NLayout position="absolute">
        <NLayoutHeader bordered class="d-flex align-items-center justify-between pad-3">
          <RouterLink to={{ name: "index" }} class="font-large mar-r-5-item">
            沃德影视
          </RouterLink>
          <form action="" class="d-flex mar-r-3" style={{ width: "600px" }}>
            <NInputGroup>
              <NInput placeholder="搜索影视剧..." clearable size="large" />
              <NButton type="primary" size="large" attrType="submit">
                搜索
              </NButton>
            </NInputGroup>
          </form>
          <div class="flex-item-extend d-flex justify-end">
            <NDropdown options={themeTypes} onSelect={e => changeThemeType(e)}>
              <NButton size="large" class="mar-r-3-item" circle>
                {{
                  icon: () => (
                    <NIcon>
                      <WbSunnyFilled />
                    </NIcon>
                  ),
                }}
                {/* {globalTheme.value === null ? "亮色" : "暗色"} */}
              </NButton>
            </NDropdown>
            <NTooltip>
              {{
                default: () => <span>设置</span>,
                trigger: () => (
                  <NButton size="large" class="mar-r-3-item" circle>
                    {{
                      icon: () => (
                        <NIcon>
                          <SettingsFilled />
                        </NIcon>
                      ),
                    }}
                  </NButton>
                ),
              }}
            </NTooltip>
          </div>
        </NLayoutHeader>
        <NLayout hasSider position="absolute" style={{ top: "64px" }}>
          <NLayoutSider v-model={[collapsed.value, "collapsed"]} bordered showTrigger nativeScrollbar={false} collapseMode="width">
            <NMenu
              collapsed={collapsed.value}
              options={menus.value}
              value={selectedMenu.value}
              defaultExpandedKeys={defaultExpandedKeys.value}
            ></NMenu>
          </NLayoutSider>
          <NLayout nativeScrollbar={false}>
            <div class="pad-4">
              <RouterView />
            </div>
          </NLayout>
        </NLayout>
      </NLayout>
    );
  },
});
