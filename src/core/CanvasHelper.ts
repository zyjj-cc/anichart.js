import { createCanvas } from "canvas";
import { canvasRenderer, CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
import { Text } from "./component/Text";
export class CanvasHelper {
  isPointInPath(area: Path2D | string, x: number, d: number): any {
    if (typeof area == "string") {
      area = new Path2D(area);
    }
    return this.renderer.ctx?.isPointInPath(area, x, d);
  }
  renderer: CanvasRenderer = canvasRenderer;
  constructor() {
    if (typeof window == "undefined") {
      // node
      var nodeCanvas = createCanvas(1920, 1080);
      this.renderer.canvas = nodeCanvas;
      this.renderer.ctx = nodeCanvas.getContext("2d");
    } else {
      // browser
      var canvas = document.querySelector("canvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
      }
      this.renderer.canvas = canvas;
      this.renderer.ctx = canvas.getContext("2d")!;
    }
  }

  measure<T extends Component>(c: T) {
    this.renderer.ctx.save();
    if (c.type === "Text") {
      return this.measureText((c as unknown) as Text);
    }
    this.renderer.ctx.restore();
    return { width: 0 } as TextMetrics;
  }
  private measureText(c: Text) {
    this.renderer.prerenderText(c);
    const res = this.renderer.ctx.measureText(c.text ?? "");
    this.renderer.ctx.restore();
    return res;
  }
}
export const canvasHelper = new CanvasHelper();
