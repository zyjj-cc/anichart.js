import { imageLoader } from './ImageLoader'
import { csv, json } from 'd3-fetch'
export class Resource {
  async setup () {
    const promises = [] as Array<Promise<any>>
    for (const [key, promise] of this.imagesPromise) {
      void promise.then((src: CanvasImageSource | null) => {
        if (src != null) return this.images.set(key, src)
        else return this.images
      })
      promises.push(promise)
    }
    for (const [key, promise] of this.dataPromise) {
      void promise.then((data: any) => this.data.set(key, data))
      promises.push(promise)
    }
    return await Promise.all(promises)
  }

  private readonly imagesPromise: Map<
  string,
  Promise<CanvasImageSource | null>
  > = new Map()

  images: Map<string, CanvasImageSource> = new Map()

  private readonly dataPromise: Map<string, Promise<any>> = new Map()
  data: Map<string, any> = new Map()

  async loadImage (path: string, name?: string) {
    const promise = imageLoader.load(path)
    if (name) {
      this.imagesPromise.set(name, promise)
    }
    this.imagesPromise.set(path, promise)
    return await promise
  }

  async loadCSV (path: string | any, name: string) {
    if (typeof path !== 'string') {
      path = path.default
    }
    const promise = csv(path)
    this.dataPromise.set(name, promise)
    return await promise
  }

  async loadJSON (path: string | any, name: string) {
    if (typeof path !== 'string') {
      path = path.default
    }
    const promise = json(path)
    this.dataPromise.set(name, promise)
    return await promise
  }
}
