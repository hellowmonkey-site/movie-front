import { defaultCompressImageOpts } from "@/store/common";
import Compressor from "compressorjs";

export const compressImage = (file: File, opts = {}) => {
  const { quality, maxWidth, convertSize, maxHeight } = Object.assign({}, defaultCompressImageOpts, opts);
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      convertSize,
      success(res) {
        res = new File([res], "file", {
          type: res.type,
          lastModified: Date.now(),
        });
        resolve(res);
      },
      error(e) {
        reject(e);
      },
    });
  });
};
