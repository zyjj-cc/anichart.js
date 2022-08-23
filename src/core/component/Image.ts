import { BaseCompOptions, Component } from './Component'

export interface ImageOptions extends BaseCompOptions {
  slicePosition?: { x: number, y: number }
  sliceShape?: { width: number, height: number }
  shape?: { width: number, height: number }
  src: string
}

export class Image extends Component {
  readonly type = 'Image'
  src: string
  slicePosition: { x: number, y: number } = { x: 0, y: 0 }
  sliceShape: { width: number, height: number }
  shape: { width: number, height: number }
  constructor (options?: ImageOptions) {
    super(options ?? { key: 'image' })
    if (options != null) {
      if (options.src) this.src = options.src
      if (options.shape != null) this.shape = options.shape
      if (options.sliceShape != null) this.sliceShape = options.sliceShape
      if (options.slicePosition != null) this.slicePosition = options.slicePosition
    }
  }
}
