import { CloseCircleFilled, DownOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import {
  Button,
  Drawer,
  DropdownButton,
  Input,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuItem,
  Modal,
  SubMenu,
  Tag,
} from "ant-design-vue";
import { defineComponent, KeepAlive, ref } from "vue";
import { RouteLocationNormalizedLoaded, RouterLink, RouterView, useRouter } from "vue-router";

export default defineComponent({
  components: {},
  props: {},
  emits: [],
  setup(props, ctx) {
    const router = useRouter();
    const collapsed = ref(false);

    return () => (
      <div class="d-flex app-layout full-height-vh direction-column">
        <LayoutHeader>
          <Menu theme="dark" mode="horizontal">
            <MenuItem>一级菜单</MenuItem>
          </Menu>
        </LayoutHeader>
        <div class="d-flex align-items-center pad-h-5 pad-v-3">
          <div class="app-tags-list flex-item-extend d-flex align-items-center">
            <div class="app-tags-item d-flex align-items-center mar-r-2-item">
              <span class="mar-r-2">导航</span>
              <CloseCircleFilled />
            </div>
            <div class="app-tags-item d-flex align-items-center mar-r-2-item">
              <span class="mar-r-2">导航</span>
              <CloseCircleFilled />
            </div>
          </div>
          <DropdownButton>
            {{
              icon: () => <DownOutlined />,
              overlay: () => (
                <Menu>
                  <MenuItem onClick={e => console.log(e)}>关闭当前</MenuItem>
                  <MenuItem onClick={e => console.log(e)}>关闭其他</MenuItem>
                  <MenuItem onClick={e => console.log(e)}>关闭全部</MenuItem>
                </Menu>
              ),
            }}
          </DropdownButton>
        </div>
        <div class="flex-item-extend pad-l-5 pad-r-5 overflow-y-auto">
          <div class="app-content">
            {/* <div class="app-sider"></div> */}
            <LayoutSider collapsible class="app-sider" v-model={[collapsed.value, "collapsed"]}>
              <Menu theme="light" mode="inline">
                <SubMenu title="二级菜单">
                  <MenuItem>三级菜单</MenuItem>
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
