import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";
import { isIE } from "@/helper/validate";
import { lightTheme, NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider, useDialog } from "naive-ui";

export default defineComponent({
  setup() {
    return () => (
      <NConfigProvider theme={lightTheme}>
        <NDialogProvider>
          <NMessageProvider>
            <NNotificationProvider>
              <RouterView />
            </NNotificationProvider>
          </NMessageProvider>
        </NDialogProvider>
      </NConfigProvider>
    );
  },
});
