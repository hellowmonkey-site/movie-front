import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider } from "naive-ui";
import { globalTheme } from "@/service/theme";

export default defineComponent({
  setup() {
    return () => (
      <NDialogProvider>
        <NMessageProvider>
          <NNotificationProvider>
            <NConfigProvider theme={globalTheme.value} themeOverrides={{ common: { fontSize: "16px" } }}>
              <RouterView />
            </NConfigProvider>
          </NNotificationProvider>
        </NMessageProvider>
      </NDialogProvider>
    );
  },
});
