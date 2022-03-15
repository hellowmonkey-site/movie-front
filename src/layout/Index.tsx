import { removeTab, tabList } from "@/service/common";
import { DownOutlined, UpCircleFilled } from "@ant-design/icons-vue";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  DropdownButton,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuDivider,
  MenuItem,
  SubMenu,
  TabPane,
  Tabs,
} from "ant-design-vue";
import { defineComponent, KeepAlive, ref } from "vue";
import { RouteLocationNormalizedLoaded, RouterView, useRoute, useRouter } from "vue-router";
import Logo from "@/static/image/logo.png";
import { userInfo } from "@/service/user";

export default defineComponent({
  components: {},
  props: {},
  emits: [],
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();
    const collapsed = ref(false);
    const activeCurrentTab = () => {
      const prev = tabList.value[tabList.value.length - 1];
      if (!prev) {
        router.replace("/");
        return;
      }

      if (route.name !== prev.name) {
        router.replace({ name: String(prev.name) });
      }
    };

    return () => (
      <div class="d-flex app-layout full-height-vh direction-column">
        <LayoutHeader class="d-flex justify-between align-items-center app-header">
          <img src={Logo} alt="logo" class="app-logo mar-r-5" />
          <Menu theme="dark" mode="horizontal" selectedKeys={["1"]} onSelect={e => console.log(e)} class="flex-item-extend">
            {["1", "2", "3", "4"].map(item => (
              <MenuItem title={item} key={item}>
                一级菜单{item}
              </MenuItem>
            ))}
          </Menu>
          <Dropdown>
            {{
              default: () => (
                <div class="d-flex align-items-center">
                  <Avatar src={Logo} />
                  <span class="mar-l-2 font-light mar-r-2">{userInfo.username}</span>
                  <DownOutlined style="color: #fff" />
                </div>
              ),
              overlay: () => (
                <Menu>
                  <MenuItem
                    onClick={e => {
                      console.log(e);
                    }}
                  >
                    修改密码
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    danger
                    onClick={e => {
                      console.log(e);
                      router.push({ name: "login" });
                    }}
                  >
                    退出登录
                  </MenuItem>
                </Menu>
              ),
            }}
          </Dropdown>
        </LayoutHeader>
        {tabList.value.length ? (
          <div class="d-flex align-items-center app-tabs">
            <Tabs
              hideAdd
              type="editable-card"
              class="flex-item-extend"
              activeKey={String(route.name)}
              onEdit={name => {
                removeTab(name);
                activeCurrentTab();
              }}
              onChange={name => {
                router.push({ name });
              }}
            >
              {tabList.value.map(item => (
                <TabPane tab={String(item.meta.title || "导航")} closable key={item.name}></TabPane>
              ))}
            </Tabs>

            <Dropdown>
              {{
                default: () => <Button>{{ icon: () => <DownOutlined /> }}</Button>,
                overlay: () => (
                  <Menu>
                    <MenuItem
                      onClick={e => {
                        removeTab(String(route.name));
                        activeCurrentTab();
                      }}
                    >
                      关闭当前
                    </MenuItem>
                    <MenuItem
                      onClick={e => {
                        tabList.value = tabList.value.filter(v => v.name === route.name);
                      }}
                    >
                      关闭其他
                    </MenuItem>
                    <MenuItem
                      onClick={e => {
                        tabList.value = [];
                        router.replace("/");
                      }}
                    >
                      关闭全部
                    </MenuItem>
                  </Menu>
                ),
              }}
            </Dropdown>
          </div>
        ) : null}
        <div class="flex-item-extend pad-l-5 pad-r-5 overflow-y-auto">
          <div class="app-content">
            <LayoutSider collapsible class="app-sider" v-model={[collapsed.value, "collapsed"]}>
              <Menu
                theme="light"
                mode="inline"
                onSelect={({ key }) => {
                  router.push({ name: key });
                }}
              >
                <SubMenu title="二级菜单">
                  {{
                    default: () => {
                      return ["user-index", "article-index"].map(name => (
                        <MenuItem title="111" key={name}>
                          {{
                            default: () => <span>{name}</span>,
                            icon: () => <UpCircleFilled />,
                          }}
                        </MenuItem>
                      ));
                    },
                    icon: () => <UpCircleFilled />,
                  }}
                </SubMenu>
              </Menu>
            </LayoutSider>
            <div class={["app-router", collapsed.value ? "collapsed" : ""]}>
              <RouterView>
                {{
                  default: ({ Component, route }: { Component: () => JSX.Element; route: RouteLocationNormalizedLoaded }) => {
                    if (route.meta.keepAlive) {
                      return (
                        <KeepAlive>
                          <Component />
                        </KeepAlive>
                      );
                    } else {
                      return (
                        <Drawer
                          width="90vw"
                          visible={true}
                          maskClosable={false}
                          title={String(route.meta?.title || "详情")}
                          wrapClassName="app-drawer"
                          onClose={() => {
                            if (history.state.back) {
                              router.back();
                            } else {
                              router.replace("/");
                            }
                          }}
                        >
                          <Component />
                        </Drawer>
                      );
                    }
                  },
                }}
              </RouterView>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
