import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import { StorageType } from "@/config/type";
let div: HTMLElement, viewer: Viewer;

type Opt = string | StorageType[] | string[];

export const imagePreview = (params: Opt, index = 0) => {
  let images: Array<string | StorageType> = [];
  if (typeof params === "string") {
    images = [params];
  }
  if (!Array.isArray(images)) {
    return;
  }
  const imgStr = images
    .map(item => {
      if (typeof item !== "string") {
        return item.url;
      }
      return item;
    })
    .map(item => String(item.replace("_thumb", "")))
    .map((src: string) => `<img src="${src}" />`)
    .join("");
  if (!div) {
    div = document.createElement("div");
  }
  div.innerHTML = imgStr;
  if (viewer) {
    viewer.destroy();
  }
  const opts = {
    initialViewIndex: index,
  };
  viewer = new Viewer(div, opts);
  viewer.show();
};
