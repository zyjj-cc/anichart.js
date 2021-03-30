type LoadImageFunc = (url: string) => Promise<CanvasImageSource | null>;
export class ImageLoader {
  load: LoadImageFunc;
  constructor() {
    this.load = (url: string) =>
      new Promise((resolve) => {
        if (typeof window === "undefined") {
          // Load image in node.js
          const { loadImage } = require("canvas");
          loadImage(url).then(
            (
              image:
                | CanvasImageSource
                | PromiseLike<CanvasImageSource | null>
                | null
            ) => {
              resolve(image);
            }
          );
        } else {
          const image = new Image();
          image.onload = () => {
            resolve(image);
          };
          image.onerror = () => {
            // if error, still accept the result but not load this image
            resolve(null);
          };
          image.src = url;
          image.crossOrigin = "anonymous";
        }
      });
  }
}

export const imageLoader = new ImageLoader();
