import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import { StorageType } from "@/config/type";
let div: HTMLElement, viewer: Viewer;

type Opt = string | StorageType[] | string[];

export const imagePreview = (params: Opt, initialViewIndex = 0) => {
  let images: string[] = [];
  if (typeof params === "string") {
    images = [params];
  } else {
    images = params.map(item => {
      if (typeof item !== "string") {
        return item.path;
      }
      return item;
    });
  }
  images = images.filter(v => !!v);
  if (!images.length) {
    return;
  }
  const imgStr = images
    .map(src => src.replace("_thumb", ""))
    .map((src: string) => `<img src="${src}" />`)
    .join("");
  if (!div) {
    div = document.createElement("div");
  }
  div.innerHTML = imgStr;
  if (viewer) {
    viewer.destroy();
  }
  viewer = new Viewer(div, { initialViewIndex });
  viewer.show();
};
