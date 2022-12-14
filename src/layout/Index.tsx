import { isIE } from "@/helper/validate";
import { categorys, getCategoryList } from "@/service/category";
import {
  appConfig,
  dialog,
  // canInstall,
  fitVideoSizes,
  isFullscreen,
  isMobileWidth,
  isShowBackTop,
  menuCollapsed,
  playbackRates,
  searchIpt,
  setAppConfig,
  setFullscreen,
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
  NSelect,
  NSlider,
  NSpin,
  NSwitch,
  NTooltip,
  useOsTheme,
} from "naive-ui";
import { computed, defineComponent, onMounted, ref, Transition } from "vue";
import { onBeforeRouteUpdate, RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import {
  AndroidOutlined,
  ChevronLeftRound,
  ChevronRightRound,
  ContentPasteSearchOutlined,
  FavoriteBorderOutlined,
  FileDownloadFilled,
  FileDownloadOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  HistoryOutlined,
  HomeFilled,
  LogInOutlined,
  LogOutOutlined,
  MenuOutlined,
  MovieFilterFilled,
  // OpenInBrowserOutlined,
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
// import pwaInstallHandler from "pwa-install-handler";
import { fullVideoList } from "@/service/video";
import { DropdownMixedOption } from "naive-ui/lib/dropdown/src/interface";
import { clearUser, user } from "@/service/user";
import { getFullUrl, goTop } from "@/helper";
import { getPlayHistory } from "@/service/history";
import { plusSetStatusBar } from "@/service/plus";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();
    const os = useOsTheme();
    const menuLoading = ref(false);
    const routeTransitionName = ref("page-shadow slider-left");
    const routeHistorys = [route.path];

    const isVideoPage = computed(() => {
      return route.name === "video";
    });

    const videoDetail = computed(() => {
      return fullVideoList.value.find(v => v.id === Number(route.params.videoId));
    });
    const selectedMenu = computed(() => {
      const { name } = route;
      if (name === "index") {
        return "index";
      }
      if (name === "category") {
        return String(route.params.category) || null;
      }
      if ((isVideoPage.value || name === "play") && videoDetail.value) {
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
          return <RouterLink to={{ name: "index" }}>??????</RouterLink>;
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
                      return <RouterLink to={{ name: "category", params: { category: item.url } }}>??????{item.name}</RouterLink>;
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
      const userMenus = [
        {
          label: "????????????",
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
          label: "????????????",
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
      ];
      if (user.value.token) {
        userMenus.push(
          {
            label: "????????????",
            key: "collect",
            icon() {
              return (
                <NIcon>
                  <FavoriteBorderOutlined />
                </NIcon>
              );
            },
          },
          {
            key: "",
            type: "divider",
          },
          {
            label: "????????????",
            key: "logout",
            icon() {
              return (
                <NIcon>
                  <LogOutOutlined />
                </NIcon>
              );
            },
          }
        );
      } else {
        userMenus.push({
          label: "??????",
          key: "login",
          icon() {
            return (
              <NIcon>
                <LogInOutlined />
              </NIcon>
            );
          },
        });
      }
      return userMenus;
    });

    const downloadList = computed(() => {
      const list = [
        {
          label: "Windows?????????",
          key: `${config.productName}_${config.version}_x64_en-US.msi`,
          icon() {
            return (
              <NIcon>
                <WindowOutlined />
              </NIcon>
            );
          },
        },
        {
          label: "Android?????????",
          key: `${config.productName}_${config.version}.apk`,
          icon() {
            return (
              <NIcon>
                <AndroidOutlined />
              </NIcon>
            );
          },
        },
      ];
      // if (canInstall.value) {
      //   list.push({
      //     label: "???????????????",
      //     key: "browser",
      //     icon() {
      //       return (
      //         <NIcon>
      //           <OpenInBrowserOutlined />
      //         </NIcon>
      //       );
      //     },
      //   });
      // }
      return list;
    });

    const marks: Record<string, string> = {};
    playbackRates.value
      .map(v => String(v))
      .forEach((v: string) => {
        marks[v] = v;
      });

    // ??????????????????
    const defaultExpandedKeys = computed(() => {
      const selected = selectedMenu.value;
      if (!selected) {
        return [];
      }
      const data = menus.value.find(item => item.children?.length && item.children.some(v => v.key === selected));
      return data?.key ? [data.key] : [];
    });

    onMounted(() => {
      menuLoading.value = true;
      getCategoryList().finally(() => {
        menuLoading.value = false;
      });
      getPlayHistory();

      // ???????????????IE?????????
      if (isIE) {
        dialog.warning({
          title: "????????????",
          content:
            "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????360?????????????????????????????????????????????",
          positiveText: "????????????",
          maskClosable: false,
          onPositiveClick() {
            window.open("https://www.microsoft.com/zh-cn/edge");
            return Promise.reject({ message: "" });
          },
        });
      }

      // ???????????????
      document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key === "g") {
          e.preventDefault();
          searchIpt.value?.focus();
        }
      });
      if (!isMobileWidth.value) {
        searchIpt.value?.focus();
      }
    });

    onBeforeRouteUpdate((to, from) => {
      const [prevRouteName, prevRouteName2 = route.path] = routeHistorys.slice(routeHistorys.length - 2);
      if (prevRouteName === to.path && prevRouteName2 === from.path) {
        routeTransitionName.value = "page-shadow slider-right";
        routeHistorys.pop();
      } else {
        routeTransitionName.value = "page-shadow slider-left";
        routeHistorys.push(to.path);
      }
    });

    return () => (
      <>
        <NLayout position={isMobileWidth.value ? "static" : "absolute"} class={"app-layout"}>
          <Transition name="fade">
            {isMobileWidth.value && isVideoPage.value ? (
              <div class="video-info-bg" style={{ backgroundImage: `url(${videoDetail.value?.cover})` }} />
            ) : null}
          </Transition>
          <NLayoutHeader
            data-tauri-drag-region
            bordered
            class={[
              "d-flex align-items-center justify-between pad-3 ani",
              { transparent: isMobileWidth.value && isVideoPage.value && menuCollapsed.value && !isShowBackTop.value },
            ]}
          >
            {isMobileWidth.value ? (
              <NTooltip>
                {{
                  default: () => <span>??????</span>,
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
              <div class="mar-r-4-item">
                <NTooltip>
                  {{
                    default: () => <span>??????</span>,
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
                    default: () => <span>??????</span>,
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
                    default: () => <span>??????</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
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
                <NTooltip>
                  {{
                    default: () => <span>{isFullscreen.value ? "????????????" : "??????"}</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
                        type="primary"
                        circle
                        onClick={() => {
                          setFullscreen(!isFullscreen.value);
                        }}
                      >
                        {{
                          icon: () => <NIcon>{isFullscreen.value ? <FullscreenExitOutlined /> : <FullscreenOutlined />}</NIcon>,
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              </div>
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
            <div class="flex-item-extend d-flex justify-end" data-tauri-drag-region onDblclick={goTop}>
              {config.isWeb ? (
                <>
                  <NDropdown
                    options={downloadList.value}
                    trigger="click"
                    onSelect={fileName => {
                      // if (suffix === "browser") {
                      //   pwaInstallHandler.install().then(installed => {
                      //     if (installed) {
                      //       message.success("?????????????????????~");
                      //     } else {
                      //       message.error("???????????????????????????");
                      //     }
                      //   });
                      // } else {
                      // }
                      window.open(getFullUrl(config.baseURL, config.downloadUrl, fileName));
                    }}
                  >
                    <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                      {{
                        default: () => <span>???????????????</span>,
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
                </>
              ) : null}
              {isMobileWidth.value ? (
                <NTooltip placement="left">
                  {{
                    default: () => <span>??????</span>,
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
                  plusSetStatusBar();
                }}
              >
                <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                  {{
                    default: () => <span>????????????</span>,
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
                    if (typeof plus === "undefined") {
                      location.reload();
                    } else {
                      router.push({ name: "login" });
                    }
                  } else {
                    router.push({ name });
                  }
                }}
              >
                <NTooltip placement={isMobileWidth.value ? "left" : undefined}>
                  {{
                    default: () => <span>{user.value.username || "????????????"}</span>,
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
                  default: () => <span>????????????</span>,
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
          <NLayout hasSider position={isMobileWidth.value ? "static" : "absolute"} style={{ top: isMobileWidth.value ? 0 : "61px" }}>
            <NLayoutSider
              v-model={[menuCollapsed.value, "collapsed"]}
              bordered
              showTrigger
              nativeScrollbar={isMobileWidth.value}
              collapseMode={isMobileWidth.value ? "transform" : "width"}
              collapsedWidth={isMobileWidth.value ? 0 : undefined}
            >
              {menuLoading.value ? (
                <div class="d-flex align-items-center justify-center full-height-vh">
                  <NSpin />
                </div>
              ) : (
                <NMenu
                  collapsed={menuCollapsed.value}
                  options={menus.value}
                  value={selectedMenu.value}
                  defaultExpandedKeys={defaultExpandedKeys.value}
                ></NMenu>
              )}
            </NLayoutSider>
            <NLayout nativeScrollbar={isMobileWidth.value}>
              {isMobileWidth.value ? (
                <Transition name={routeTransitionName.value}>
                  <RouterView />
                </Transition>
              ) : (
                <RouterView />
              )}

              {/* ???????????? */}
              <NBackTop
                visibilityHeight={100}
                onUpdate:show={(show: boolean) => {
                  isShowBackTop.value = show;
                }}
                listenTo={isMobileWidth.value ? document : undefined}
              />
            </NLayout>
          </NLayout>
        </NLayout>
        <NDrawer v-model={[settingOpen.value, "show"]} class="setting-drawer" width="90vw">
          <NDrawerContent title="????????????" closable nativeScrollbar={isMobileWidth.value}>
            <NDivider titlePlacement="left">??????</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">????????????</span>
              <NSelect
                style={{ width: "65%" }}
                value={appConfig.value.themeType}
                onUpdateValue={themeType => setAppConfig({ themeType })}
                options={themeTypes.map(v => {
                  return {
                    label: v.label,
                    value: v.key,
                  };
                })}
              ></NSelect>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">????????????</span>
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
            <NDivider titlePlacement="left">?????????</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">????????????</span>
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
              <span class="font-gray font-small mar-r-7 flex-item-extend">??????????????????</span>
              <NSlider
                style={{ width: "65%" }}
                min={playbackRates.value[0]}
                max={playbackRates.value[playbackRates.value.length - 1]}
                step="mark"
                marks={marks}
                value={appConfig.value.playbackRate}
                onUpdateValue={playbackRate => {
                  setAppConfig({ playbackRate });
                }}
              ></NSlider>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">????????????</span>
              <NSelect
                style={{ width: "65%" }}
                value={appConfig.value.fitVideoSize}
                onUpdateValue={fitVideoSize => setAppConfig({ fitVideoSize })}
                options={fitVideoSizes.map(v => {
                  return {
                    label: v.text,
                    value: v.value,
                  };
                })}
              ></NSelect>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">????????????</span>
              <NSwitch
                value={appConfig.value.autoplay}
                onUpdateValue={autoplay => {
                  setAppConfig({ autoplay });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">???????????????</span>
              <NSwitch
                value={appConfig.value.pip}
                onUpdateValue={pip => {
                  setAppConfig({ pip });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">???????????????</span>
              <NSwitch
                value={appConfig.value.miniplayer}
                onUpdateValue={miniplayer => {
                  setAppConfig({ miniplayer });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">?????????????????????</span>
              <NSwitch
                value={appConfig.value.autoNext}
                onUpdateValue={autoNext => {
                  setAppConfig({ autoNext });
                }}
              ></NSwitch>
            </div>
            {config.isMsi ? (
              <div class="d-flex justify-between align-items-center mar-b-6-item">
                <span class="font-gray font-small mar-r-7 flex-item-extend">????????????</span>
                <NSwitch
                  value={appConfig.value.fullscreenPlay}
                  onUpdateValue={fullscreenPlay => {
                    setAppConfig({ fullscreenPlay });
                  }}
                ></NSwitch>
              </div>
            ) : null}
            <NDivider titlePlacement="left">??????</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">??????????????????</span>
              <NSwitch
                value={appConfig.value.recommend}
                onUpdateValue={recommend => {
                  setAppConfig({ recommend });
                }}
              ></NSwitch>
            </div>
            <NDivider titlePlacement="left">??????</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">??????????????????</span>
              <NSwitch
                value={appConfig.value.searchLog}
                onUpdateValue={searchLog => {
                  setAppConfig({ searchLog });
                }}
              ></NSwitch>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">??????????????????</span>
              <NSwitch
                value={appConfig.value.playLog}
                onUpdateValue={playLog => {
                  setAppConfig({ playLog });
                }}
              ></NSwitch>
            </div>
            <NDivider titlePlacement="left">????????????</NDivider>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7 flex-item-extend">??????</span>
              <span>v {config.version}</span>
            </div>
            <div class="d-flex justify-between align-items-center mar-b-6-item">
              <span class="font-gray font-small mar-r-7">??????</span>
              <div class="flex-item-extend d-flex justify-end">
                <span>????????????????????????????????????????????????????????????</span>
              </div>
            </div>
          </NDrawerContent>
        </NDrawer>

        <Transition name="fade">
          {isMobileWidth.value && !menuCollapsed.value ? (
            <div
              class="app-bg"
              onClick={() => {
                menuCollapsed.value = true;
              }}
            />
          ) : null}
        </Transition>
      </>
    );
  },
});
