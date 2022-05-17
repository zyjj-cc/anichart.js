import { Stage } from "./Stage";
import { select } from "d3-selection";
import { timer } from "d3-timer";
import dayjs from "dayjs";
export class Controller {
  stage: Stage;
  constructor(stage: Stage) {
    this.stage = stage;
  }

  render() {
    const ctrl = select("body")
      .insert("div", ":first-child")
      .attr("id", "anichart-ctrl")
      .attr(
        "style",
        `border-radius:10px; width:300px; position: absolute; z-index: 9;   background: #ffffff55; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); border-width: 1px 1px 5px 1px; border-style: solid; border-color: #d3d3d3; text-align: center;`
      );
    ctrl.datum(this.stage);
    const dragger = ctrl
      .append("div")
      .attr(
        "style",
        "border-radius:10px 10px 0px 0px; padding: 10px; cursor: move; z-index: 10; background-color: #2196F3DD; color: #fff;"
      )
      .attr("id", "anichart-ctrl-dragger");
    dragger.append("div").text("Anichart Controller");
    let timeLabel = ctrl.append("div").style("margin-top", "10px");
    let progresser = ctrl
      .append("div")
      .style("padding-left", "10px")
      .style("padding-right", "10px")
      .append("input")
      .attr("type", "range")
      .attr("style", "width: 100%; ")
      .attr("step", "any")
      .attr("min", 0)
      .attr("value", 0)
      .attr("max", (d: Stage) => d.options.sec)
      .on("input", function (_, d: Stage) {
        d.sec = Number(this.value);
        d.render();
      });
    let play = ctrl
      .append("div")
      .style("padding-bottom", "10px")
      .append("button")
      .attr(
        "style",
        `width: 90px; background-color: #2196F3DD; border: none; border-radius:10px; color: white; padding: 12px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;`
      )
      .on("click", function (_, d: Stage) {
        d.play();
      });
    this.makeDraggable("anichart-ctrl", "anichart-ctrl-dragger");
    timer(() => {
      timeLabel.text(
        (d: Stage) =>
          `${dayjs(d.sec * 1000).format("mm:ss")} /
          ${dayjs(d.options.sec * 1000).format("mm:ss")}`
      );
      if (this.stage.playing) {
        progresser.node()!.value = this.stage.sec.toString();
      }
      play.text((d: Stage) => (d.playing ? "PAUSE" : "PLAY"));
    });
  }

  makeDraggable(contentID: string, draggerID: string) {
    // Make the DIV element draggable:
    const div = document.getElementById(contentID);
    const dragger = document.getElementById(draggerID);
    if (div && dragger) dragElement(div, dragger);
    function dragElement(elmnt: HTMLElement, dragger: HTMLElement) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (dragger) {
        // if present, the header is where you move the DIV from:
        dragger.onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }

  play() {
    this.stage.play();
  }
}
