import { image } from "d3-fetch";
import * as ani from "../src/index";
const stage = new ani.Stage();
stage.options.fps = 30;
stage.options.sec = 10;
stage.output = false;

const bgAni = new ani.RectAni();
bgAni.component.shape = {
  width: stage.canvas.width,
  height: stage.canvas.height,
};
bgAni.component.fillStyle = "#1e1e1e";

const textLinesAni = new ani.TextLinesAni();

textLinesAni.component.fillStyle = "#eee";
textLinesAni.component.textAlign = "center";
textLinesAni.component.textBaseline = "middle";
textLinesAni.component.position = {
  x: stage.canvas.width / 2,
  y: stage.canvas.height / 2,
};
const textAnichart = new ani.TextAni();
textAnichart.component.fontSize = 48;
textAnichart.component.font = "Sarasa Mono Slab SC";
textAnichart.component.text = "Anichart";
textAnichart.component.fontWeight = "bolder";
textAnichart.type = "blur";

const textJannchieStudio = new ani.TextAni();
textJannchieStudio.component.fillStyle = "#666";
textJannchieStudio.component.fontSize = 24;
textJannchieStudio.component.text = "Powered by Jannchie Studio";
textJannchieStudio.component.font = "Sarasa Mono Slab SC";
textJannchieStudio.type = "blur";

// textLinesAni.children.push(textAnichart);
// textLinesAni.children.push(textJannchieStudio);

stage.resource.loadImage("./data/ANI.png", "logo");
stage.resource.loadImage(
  "https://avatars3.githubusercontent.com/u/29743310?s=460&u=8e0d49b98c35738afadc04e70c7f3918d6ad8cdb&v=4",
  "jannchie"
);
stage.resource.loadCSV("./data/test.csv", "data");
// stage.resource.loadData("./data/test-meta.csv", "meta");

const barChart = new ani.BarChart({
  shape: { width: stage.canvas.width, height: 300 },
  labelFormat(id) {
    return id;
    // return meta.get(id).name;
  },
  dy: 5,
  itemCount: 5,

  barInfoOptions: {
    fillStyle: "#222",
    strokeStyle: undefined,
  },
  dateFormat: "%Y-%m-%d %H:%M:%S",
  aniTime: [4, 10],
});

const lineChart = new ani.LineChart({
  aniTime: [4, 10],
  shape: { width: stage.canvas.width, height: stage.canvas.height / 2 },
  position: { x: 0, y: stage.canvas.height / 2 },
});

stage.addChild(bgAni);

stage.addChild(textLinesAni);

const map = new ani.MapChart({
  showLabel: true,
  projectionType: "orthographic",
});
stage.addChild(map);

stage.addChild(barChart);
stage.addChild(lineChart);


const pie = new ani.PieChart({
  aniTime: [4, 10],
  radius: [80, 120],
  position: { x: stage.canvas.width / 2, y: stage.canvas.height / 2 },
});
stage.addChild(pie);
// Don't use it. Generating animations using this method will result in rendering errors in the Node environment.
// const img = ani.showImage({
//   src: "./data/ANI.png",
// });
// stage.addChild(img);

stage.resource.loadJSON(
  `https://raw.githubusercontent.com/Jannchie/geoJson-map-data/main/world.json`,
  "map"
);
new ani.Controller(stage).render();
image("./pic/pattern.png").then(d => {
  const pattern = stage.canvas.getContext("2d")?.createPattern(d, "");
  if (pattern) {
    map.defaultFill = pattern!;
  }
});
async function start() {
  stage.play();
}
start().then(() => { });

if (typeof window !== "undefined") {
  (window as any).stage = stage;
  (window as any).ani = ani;
  (window as any).map = map;
}
