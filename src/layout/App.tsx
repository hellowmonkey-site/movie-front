import { computed, defineComponent } from "vue";
import { RouterView } from "vue-router";
import { GlobalThemeOverrides, NConfigProvider, NDialogProvider, NGlobalStyle, NMessageProvider, NNotificationProvider } from "naive-ui";
import { appConfig, globalTheme, themeColors } from "@/service/common";

export default defineComponent({
  setup() {
    const themeOverrides = computed<GlobalThemeOverrides>(() => {
      const themeColor = themeColors.find(v => v.key === appConfig.value.themeColor);
      const common: GlobalThemeOverrides["common"] = { fontSize: "16px" };
      if (themeColor) {
        common.primaryColor = themeColor.color;
        common.primaryColorHover = themeColor.hoverColor;
        common.primaryColorPressed = themeColor.pressedColor;
        common.primaryColorSuppl = themeColor.pressedColor;
      }

      return { common };
    });

    return () => (
      <NDialogProvider>
        <NMessageProvider>
          <NNotificationProvider>
            <NConfigProvider theme={globalTheme.value} themeOverrides={themeOverrides.value}>
              <NGlobalStyle />
              <RouterView />
            </NConfigProvider>
          </NNotificationProvider>
        </NMessageProvider>
      </NDialogProvider>
    );
  },
});
