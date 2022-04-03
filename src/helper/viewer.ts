import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
let div: HTMLElement, viewer: Viewer;

type Opt = string | string[];

export const imagePreview = (params: Opt, initialViewIndex = 0) => {
  let images: string[] = [];
  if (typeof params === "string") {
    images = [params];
  }
  images = images.filter(v => !!v);
  if (!images.length) {
    return;
  }
  const imgStr = images.map((src: string) => `<img src="${src}" />`).join("");
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
