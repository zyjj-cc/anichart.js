import { Ani } from "./ani/Ani";
import { CanvasRenderer } from "./CanvasRenderer";
import { Renderer } from "./Renderer";
import { Component } from "./component/Component";
import { addFrameToFFmpeg, loadffmpeg, outputMP4, removePNG } from "./FFmpeg";
import { recourse } from "./Recourse";
import { interval, Timer } from "d3";
import { eachLimit, eachSeries } from "async";
import { Canvas, createCanvas } from "canvas";

// Enable Path2D
require("canvas-5-polyfill");

export class Stage {
  compRoot: Component = new Component();
  renderer: Renderer;
  options = { sec: 5, fps: 30 };
  outputOptions = {
    fileName: "output",
    splitSec: 60,
  };
  interval: Timer | null;
  output: boolean;
  outputConcurrency = 128;
  mode = "output";
  private cFrame = 0;

  get frame(): number {
    return this.cFrame;
  }

  set frame(val: number) {
    this.cFrame = val;
  }
  get sec() {
    return this.cFrame / this.options.fps;
  }

  set sec(val: number) {
    this.cFrame = val * this.options.fps;
  }

  get totalFrames() {
    return this.options.sec * this.options.fps;
  }
  get canvas() {
    return this.renderer.canvas;
  }
  constructor(canvas?: HTMLCanvasElement) {
    this.renderer = new CanvasRenderer();
    this.renderer.stage = this;
    if (typeof window === "undefined") {
      var c = createCanvas(1920, 1080);
      this.renderer.setCanvas(c);
    } else {
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        document.body.appendChild(canvas);
      }
      this.renderer.setCanvas(canvas);
    }
    this.sec = 0;
  }

  addChild(child: Ani | Component) {
    this.compRoot.children.push(child);
  }

  render(sec?: number) {
    if (sec) {
      this.sec = sec;
    }
    this.renderer.clean();
    this.renderer.render(this.compRoot, this.compRoot.offsetSec);
  }

  loadRecourse() {
    return recourse.setup();
  }

  play(): void {
    this.loadRecourse().then(() => {
      this.doPlay();
    });
  }
  private doPlay() {
    this.setup();
    if (this.interval) {
      this.interval.stop();
      this.interval = null;
    } else if (typeof window === "undefined") {
      // node
      let f = 0;
      const fs = require("fs");
      while (f < this.totalFrames) {
        this.render(f / this.options.fps);
        const data = this.canvas.toBuffer("image/png");
        const outDir = `out`;
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir);
        }
        const p = `${outDir}/${this.outputOptions.fileName}-${f}.png`;
        fs.writeFileSync(p, data);
        console.log(p);
        f++;
      }
    } else if (this.output) {
      loadffmpeg().then(() => {
        const partCount =
          Math.floor(this.options.sec / this.outputOptions.splitSec) + 1;
        let part = 0;
        const parts: number[] = [];
        while (part++ < partCount) {
          parts.push(part);
        }

        eachSeries(parts, (p, callback) => {
          const frames: number[] = [];
          const picNameList: string[] = [];
          while (
            this.cFrame < this.totalFrames &&
            this.cFrame < p * this.outputOptions.splitSec * this.options.fps
          ) {
            this.cFrame++;
            frames.push(this.cFrame);
          }
          eachLimit(frames, this.outputConcurrency, (f, cb) => {
            this.cFrame = f;
            this.render();
            const no =
              f - (p - 1) * this.outputOptions.splitSec * this.options.fps;
            picNameList.push(`output-${no}.png`);
            const imageData = this.renderer.getImageData();
            addFrameToFFmpeg(imageData, no).then(() => cb());
          }).then(() => {
            outputMP4(this.options.fps).then(() => {
              removePNG(picNameList);
              callback();
            });
          });
        })
          // tslint:disable-next-line:no-console
          .then(() => console.log("finished!"));
      });
    } else {
      this.interval = interval((elapsed) => {
        if (this.output || this.mode === "output") {
          this.cFrame++;
        } else {
          this.cFrame = Math.floor((elapsed / 1000) * this.options.fps);
        }
        this.render();
        if (this.cFrame >= this.totalFrames) {
          this.interval!.stop();
        }
      }, (1 / this.options.fps) * 1000);
    }
  }

  setup() {
    this.setupChildren(this.compRoot);
  }

  private setupChildren(ani: Component | Ani) {
    ani.setup(this);
    if (ani instanceof Component) {
      ani.children.forEach((child) => {
        if (child instanceof Ani) {
          this.setupChildren(child);
        }
      });
    }
  }
}
