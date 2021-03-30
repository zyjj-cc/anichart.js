type LoadImageFunc = (url: string) => Promise<CanvasImageSource | null>;
export class ImageLoader {
  load: LoadImageFunc;
  constructor() {
    this.load = (url: string) =>
      new Promise((resolve) => {
        if (typeof window === "undefined") {
          // TODO: Load image in node.js
          resolve(null);
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
