import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { NConfigProvider, NDialogProvider, NGlobalStyle, NMessageProvider, NNotificationProvider } from "naive-ui";
import { globalTheme, themeOverrides } from "@/service/common";

export default defineComponent({
  setup() {
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
