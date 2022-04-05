import { isIE } from "@/helper/validate";
import { categorys, getCategoryList } from "@/service/category";
import {
  appConfig,
  canInstall,
  fitVideoSizes,
  isMobileWidth,
  menuCollapsed,
  setAppConfig,
  setDialog,
  setMessage,
  setNotification,
  settingOpen,
  themeColors,
  themeOverrides,
  ThemeTypes,
  visitedPageNum,
} from "@/service/common";
import { globalTheme, themeTypes } from "@/service/common";
import {
  MenuOption,
  NBackTop,
  NButton,
  NDivider,
  NDrawer,
  NDrawerContent,
  NDropdown,
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NRadio,
  NRadioGroup,
  NSelect,
  NSlider,
  NSwitch,
  NTooltip,
  useDialog,
  useMessage,
  useNotification,
  useOsTheme,
} from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import {
  AndroidOutlined,
  ChevronLeftRound,
  ChevronRightRound,
  CloudDownloadFilled,
  CloudDownloadOutlined,
  ContentPasteSearchOutlined,
  FileDownloadFilled,
  FileDownloadOutlined,
  HistoryOutlined,
  HomeFilled,
  LogInOutlined,
  LogOutOutlined,
  MenuOutlined,
  MovieFilterFilled,
  PersonFilled,
  PersonOutlineOutlined,
  ReplayOutlined,
  SearchFilled,
  SearchOutlined,
  SettingsFilled,
  SettingsOutlined,
  WbSunnyFilled,
  WbSunnyOutlined,
  WindowOutlined,
} from "@vicons/material";
import SearchInput from "@/component/SearchInput";
import config from "@/config";
import pwaInstallHandler from "pwa-install-handler";
import { videoDetail } from "@/service/video";
import { DropdownMixedOption } from "naive-ui/lib/dropdown/src/interface";
import { clearUser, user } from "@/service/user";
import { getFullUrl } from "@/helper";
import { getPlayHistory } from "@/service/history";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();
    const os = useOsTheme();
    const message = useMessage();
    const notification = useNotification();
    const dialog = useDialog();
    setNotification(notification);
    setDialog(dialog);
    setMessage(message);

    const selectedMenu = computed(() => {
      const { name } = route;
      if (name === "index") {
        return "index";
      }
      if (name === "category") {
        return String(route.params.category) || null;
      }
      if ((name === "video" || name === "play") && videoDetail.value) {
        const category = categorys.value.find(v => v.id === videoDetail.value?.category_id);
        if (category) {
          return category.url;
        }
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
      const list: MenuOption[] = categorys.value
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
                      return <RouterLink to={{ name: "category", params: { category: item.url } }}>全部{item.name}</RouterLink>;
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

    const userMenus = computed<DropdownMixedOption[]>(() => {
      return [
        {
          label: "观看历史",
          key: "play-history",
          icon() {
            return (
              <NIcon>
                <HistoryOutlined />
              </NIcon>
            );
          },
        },
        {
          label: "搜索历史",
          key: "search-history",
          icon() {
            return (
              <NIcon>
                <ContentPasteSearchOutlined />
              </NIcon>
            );
          },
        },
        {
          key: "",
          type: "divider",
        },
        user.value.token
          ? {
              label: "退出登录",
              key: "logout",
              icon() {
                return (
                  <NIcon>
                    <LogOutOutlined />
                  </NIcon>
                );
              },
            }
          : {
              label: "登录",
              key: "login",
              icon() {
                return (
                  <NIcon>
                    <LogInOutlined />
                  </NIcon>
                );
              },
            },
      ];
    });

    const marks: Record<string, string> = {};
    config.playbackRates
      .map(v => String(v))
      .forEach((v: string) => {
        marks[String(v)] = String(v);
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
      getCategoryList();
      getPlayHistory();

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
      <>
        <NLayout position="absolute">
          <NLayoutHeader data-tauri-drag-region bordered class="d-flex align-items-center justify-between pad-3">
            {isMobileWidth.value ? (
              <NTooltip>
                {{
                  default: () => <span>菜单</span>,
                  trigger: () => (
                    <NButton
                      class="mar-r-3-item"
                      onClick={() => {
                        menuCollapsed.value = !menuCollapsed.value;
                      }}
                    >
                      {{
                        icon: () => (
                          <NIcon>
                            <MenuOutlined />
                          </NIcon>
                        ),
                      }}
                    </NButton>
                  ),
                }}
              </NTooltip>
            ) : null}
            {config.isMsi ? (
              <>
                <NTooltip>
                  {{
                    default: () => <span>后退</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
                        type="primary"
                        circle
                        disabled={visitedPageNum.value === 0}
                        onClick={() => {
                          router.back();
                        }}
                      >
                        {{
                          icon: () => (
                            <NIcon>
                              <ChevronLeftRound />
                            </NIcon>
                          ),
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
                <NTooltip>
                  {{
                    default: () => <span>前进</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
                        type="primary"
                        circle
                        onClick={() => {
                          router.forward();
                        }}
                      >
                        {{
                          icon: () => (
                            <NIcon>
                              <ChevronRightRound />
                            </NIcon>
                          ),
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
                <NTooltip>
                  {{
                    default: () => <span>刷新</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-4-item"
                        type="primary"
                        circle
                        onClick={() => {
                          location.reload();
                        }}
                      >
                        {{
                          icon: () => (
                            <NIcon>
                              <ReplayOutlined />
                            </NIcon>
                          ),
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              </>
            ) : null}
            {isMobileWidth.value ? null : (
              <>
                <img src={getFullUrl(config.baseURL, config.imageUrl, "logo.png")} class="logo mar-r-3-item" />
                <RouterLink to={{ name: "index" }} class="font-large mar-r-5-item space-nowrap">
                  {config.title}
                </RouterLink>
              </>
            )}
            {route.name === "search" || isMobileWidth.value ? null : (
              <SearchInput
                onSubmit={keywords => {
                  router.push({ name: "search", query: { keywords } });
                }}
              />
            )}
            <div class="flex-item-extend d-flex justify-end" data-tauri-drag-region>
              {config.isWeb ? (
                <>
                  <NDropdown
                    options={[
                      {
                        label: "Windows版下载",
                        key: "msi",
                        icon() {
                          return (
                            <NIcon>
                              <WindowOutlined />
                            </NIcon>
                          );
                        },
                      },
                      {
                        label: "Android版下载",
                        key: "apk",
                        icon() {
                          return (
                            <NIcon>
                              <AndroidOutlined />
                            </NIcon>
                          );
                        },
                      },
                    ]}
                    trigger="click"
                    onSelect={suffix => {
                      window.open(getFullUrl(config.baseURL, config.downloadUrl, `hellowmonkey.${suffix}`));
                    }}
                  >
                    <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                      {{
                        default: () => <span>下载客户端</span>,
                        trigger: () => (
                          <NButton size="large" color={themeOverrides.value.common?.primaryColor} class="mar-r-3-item" circle ghost>
                            {{
                              icon: () => <NIcon>{globalTheme.value === null ? <FileDownloadOutlined /> : <FileDownloadFilled />}</NIcon>,
                            }}
                          </NButton>
                        ),
                      }}
                    </NTooltip>
                  </NDropdown>
                  {canInstall.value ? (
                    <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                      {{
                        default: () => <span>下载应用</span>,
                        trigger: () => (
                          <NButton
                            size="large"
                            class="mar-r-3-item"
                            circle
                            onClick={() => {
                              pwaInstallHandler.install().then(installed => {
                                if (installed) {
                                  message.success("恭喜您安装成功~");
                                } else {
                                  message.error("真的不打算安装么？");
                                }
                              });
                            }}
                          >
                            {{
                              icon: () => <NIcon>{globalTheme.value === null ? <CloudDownloadOutlined /> : <CloudDownloadFilled />}</NIcon>,
                            }}
                          </NButton>
                        ),
                      }}
                    </NTooltip>
                  ) : null}
                </>
              ) : null}
              {isMobileWidth.value ? (
                <NTooltip placement="left">
                  {{
                    default: () => <span>搜索</span>,
                    trigger: () => (
                      <NButton
                        size="large"
                        class="mar-r-3-item"
                        circle
                        onClick={() => {
                          router.push({ name: "search" });
                        }}
                      >
                        {{
                          icon: () => <NIcon>{globalTheme.value === null ? <SearchOutlined /> : <SearchFilled />}</NIcon>,
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              ) : null}
              <NDropdown
                options={themeTypes.map(v => {
                  return {
                    ...v,
                    icon() {
                      switch (v.key) {
                        case ThemeTypes.OS:
                          return <NIcon>{os.value === "dark" ? <WbSunnyFilled /> : <WbSunnyOutlined />}</NIcon>;
                        case ThemeTypes.LIGHT:
                          return (
                            <NIcon>
                              <WbSunnyOutlined />
                            </NIcon>
                          );
                        case ThemeTypes.DARK:
                          return (
                            <NIcon>
                              <WbSunnyFilled />
                            </NIcon>
                          );
                      }
                    },
                  };
                })}
                trigger="click"
                onSelect={themeType => {
                  setAppConfig({ themeType });
                }}
              >
                <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                  {{
                    default: () => <span>选择主题</span>,
                    trigger: () => (
                      <NButton size="large" class="mar-r-3-item" circle>
                        {{
                          icon: () => <NIcon>{globalTheme.value === null ? <WbSunnyOutlined /> : <WbSunnyFilled />}</NIcon>,
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              </NDropdown>
              <NDropdown
                options={userMenus.value}
                trigger="click"
                onSelect={name => {
                  if (name === "logout") {
                    clearUser();
                    location.reload();
                  } else {
                    router.push({ name });
                  }
                }}
              >
                <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                  {{
                    default: () => <span>{user.value.username || "个人信息"}</span>,
                    trigger: () => (
                      <NButton size="large" class="mar-r-3-item" circle>
                        {{
                          icon: () => <NIcon>{globalTheme.value === null ? <PersonOutlineOutlined /> : <PersonFilled />}</NIcon>,
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              </NDropdown>
              <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                {{
                  default: () => <span>系统设置</span>,
                  trigger: () => (
                    <NButton
                      size="large"
                      class="mar-r-3-item"
                      circle
                      onClick={() => {
                        settingOpen.value = true;
                      }}
                    >
                      {{
                        icon: () => <NIcon>{globalTheme.value === null ? <SettingsOutlined /> : <SettingsFilled />}</NIcon>,
                      }}
                    </NButton>
                  ),
                }}
              </NTooltip>
            </div>
          </NLayoutHeader>
          <NLayout hasSider position="absolute" style={{ top: "64px" }}>
            <NLayoutSider
              v-model={[menuCollapsed.value, "collapsed"]}
              bordered
              showTrigger
              nativeScrollbar={false}
              collapseMode={isMobileWidth.value ? "transform" : "width"}
              collapsedWidth={isMobileWidth.value ? 0 : undefined}
            >
              <NMenu
                collapsed={menuCollapsed.value}
                options={menus.value}
                value={selectedMenu.value}
                defaultExpandedKeys={defaultExpandedKeys.value}
              ></NMenu>
            </NLayoutSider>
            <NLayout nativeScrollbar={false}>
              <div class="pad-4">
                <RouterView />
              </div>
              <NBackTop visibilityHeight={10} />
            </NLayout>
          </NLayout>
        </NLayout>
        <NDrawer v-model={[settingOpen.value, "show"]} class="setting-drawer" width="90vw">
          <NDrawerContent title="系统设置" closable nativeScrollbar={false}>
            <NDivider titlePlacement="left">主题</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">选择主题</span>
              <NRadioGroup
                value={appConfig.value.themeType}
                onUpdateValue={themeType => {
                  setAppConfig({ themeType });
                  // changeThemeType(themeType);
                }}
              >
                {themeTypes.map(v => (
                  <NRadio key={v.key} value={v.key}>
                    {v.label}
                  </NRadio>
                ))}
              </NRadioGroup>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">主题颜色</span>
              <NSelect
                style={{ width: "65%" }}
                value={appConfig.value.themeColor}
                onUpdateValue={themeColor => setAppConfig({ themeColor })}
                options={themeColors.map(v => {
                  return {
                    label() {
                      return (
                        <div class="d-flex align-items-center">
                          <span class="color-box mar-r-3-item" style={{ backgroundColor: v.color }}></span>
                          <span style={{ color: v.color }}>{v.label}</span>
                        </div>
                      );
                    },
                    value: v.key,
                  };
                })}
              ></NSelect>
            </div>
            <NDivider titlePlacement="left">播放器</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">默认音量</span>
              <NSlider
                style={{ width: "65%" }}
                step={5}
                value={appConfig.value.volume}
                onUpdateValue={volume => {
                  setAppConfig({ volume });
                }}
              ></NSlider>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">默认播放速度</span>
              <NSlider
                style={{ width: "65%" }}
                min={config.playbackRates[0]}
                max={config.playbackRates[config.playbackRates.length - 1]}
                step="mark"
                marks={marks}
                value={appConfig.value.playbackRate}
                onUpdateValue={playbackRate => {
                  setAppConfig({ playbackRate });
                }}
              ></NSlider>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">视频布局</span>
              <NRadioGroup
                value={appConfig.value.fitVideoSize}
                onUpdateValue={fitVideoSize => {
                  setAppConfig({ fitVideoSize });
                }}
              >
                {fitVideoSizes.map(v => (
                  <NRadio key={v.value} value={v.value}>
                    {v.text}
                  </NRadio>
                ))}
              </NRadioGroup>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">自动播放</span>
              <NSwitch
                value={appConfig.value.autoplay}
                onUpdateValue={autoplay => {
                  setAppConfig({ autoplay });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">开启画中画</span>
              <NSwitch
                value={appConfig.value.pip}
                onUpdateValue={pip => {
                  setAppConfig({ pip });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">开启小窗口</span>
              <NSwitch
                value={appConfig.value.miniplayer}
                onUpdateValue={miniplayer => {
                  setAppConfig({ miniplayer });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">自动播放下一集</span>
              <NSwitch
                value={appConfig.value.autoNext}
                onUpdateValue={autoNext => {
                  setAppConfig({ autoNext });
                }}
              ></NSwitch>
            </div>
            <NDivider titlePlacement="left">推荐</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">开启相关推荐</span>
              <NSwitch
                value={appConfig.value.recommend}
                onUpdateValue={recommend => {
                  setAppConfig({ recommend });
                }}
              ></NSwitch>
            </div>
            <NDivider titlePlacement="left">历史</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">记录搜索历史</span>
              <NSwitch
                value={appConfig.value.searchLog}
                onUpdateValue={searchLog => {
                  setAppConfig({ searchLog });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">记录观看历史</span>
              <NSwitch
                value={appConfig.value.playLog}
                onUpdateValue={playLog => {
                  setAppConfig({ playLog });
                }}
              ></NSwitch>
            </div>
            <NDivider titlePlacement="left">系统信息</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">版本</span>
              <span>v {config.version}</span>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7">说明</span>
              <div class="flex-item-extend d-flex justify-end">
                <span>本站资源均来自互联网，未做存储，侵立删！</span>
              </div>
            </div>
          </NDrawerContent>
        </NDrawer>
      </>
    );
  },
});
