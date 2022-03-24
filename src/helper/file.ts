import { defaultCompressImageOpts } from "@/service/common";
import Compressor from "compressorjs";

export function compressImage(file: File, opts = {}): Promise<File> {
  const { quality, maxWidth, convertSize, maxHeight } = Object.assign({}, defaultCompressImageOpts, opts);
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      convertSize,
      success(res) {
        const data = new File([res], "file", {
          type: res.type,
          lastModified: Date.now(),
        });
        resolve(data);
      },
      error(e) {
        reject(e);
      },
    });
  });
}
