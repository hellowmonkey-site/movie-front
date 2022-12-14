/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "xgplayer-hls.js" {
  import Player from "xgplayer";
  export default Player;
}

declare let plus: any;

declare module "custom-protocol-detection";
