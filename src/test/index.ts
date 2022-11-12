import { scaleLinear } from 'd3-scale'
import * as ani from '../index'
function initStage (stage: ani.Stage) {
  stage.output = false
  void stage.resource.loadImage('./pic/pattern.png', 'pattern')
  void stage.resource.loadCSV('./data/WHO-COVID-19-global-data-sm.csv', 'data')
  // Object.keys(countries.getAlpha2Codes()).forEach((alpha2) => {
  //   stage.resource.loadImage(`https://raw.githubusercontent.com/Jannchie/flagpack/master/flags/1x1/${alpha2.toLowerCase()}.svg`, alpha2);
  // });
  stage.options.sec = 60
  const barChart = new ani.BarChart({
    visualRange: 'total',
    idField: 'Country_code',
    valueField: 'New_cases',
    dateField: 'Date_reported',
    labelFormat (id) {
      return id
      // return getName(id, "zh");
    },
    imageField: 'Country_code',
    colorField: 'Country_code',
    dy: 5,
    itemCount: 20,
    barInfoOptions: {
      fillStyle: '#222',
    },
    dateFormat: '%Y-%m-%d %H:%M:%S',
    aniTime: [4, 55],
  })

  const map = new ani.MapChart({
    aniTime: [4, 55],
    showGraticule: true,
    margin: { top: 100, left: 900, right: 10, bottom: 10 },
    labelFormat (id) {
      return id
    },
    idField: 'Country_code',
    valueField: 'New_cases',
    dateField: 'Date_reported',
    showLabel: true,
    projectionType: 'orthographic',
    mapIdField: 'alpha2Code',
    pathShadowBlur: 100,
    focusTop: true,
    visualMap: scaleLinear([1, 0.7, 0.3, 0], ['#7f1d1dFF', '#b91c1c88', '#ef444444', '#fecaca22'])
      .clamp(true),
  })
  stage.addChild(map)
  stage.addChild(barChart)
  void stage.resource.loadJSON(
    'https://raw.githubusercontent.com/Jannchie/geoJson-map-data/main/world.json',
    'map',
  )

  // stage.resource.setup().then(() => {
  //   if (stage.resource.images.get("pattern")) {
  //     const pattern = stage.canvas.getContext("2d")?.createPattern(stage.resource.images.get("pattern")!, "repeat") || undefined;
  //     if (pattern) {
  //       map.defaultFill = pattern!;
  //     }
  //   }
  // });
  return stage
}
document.documentElement.style.background = '#223'
const stage = new ani.Stage()
void initStage(stage).play()
void stage.renderController()
if (typeof window !== 'undefined') {
  // (window as any).stage = stage;
  // (window as any).ani = ani;
  // (window as any).map = map;
}
