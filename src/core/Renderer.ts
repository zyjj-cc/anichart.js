import { Ani } from './ani/Ani'
import { Stage } from './Stage'

export interface Renderer {
  render: (ani?: Ani) => void
  clean: () => void
  getImageData: () => string
  setCanvas: (canvas: any) => void
  stage: Stage
  canvas: any
}
