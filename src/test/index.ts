import { scaleLinear } from 'd3-scale'
import * as ani from '../index'
function initStage (stage: ani.Stage) {
  stage.output = false
  void stage.resource.loadImage('./pic/pattern.png', 'pattern')
  void stage.resource.loadCSV('./data/WHO-COVID-19-global-data-sm.csv', 'data').then((data) => {
    stage.resource.data.set('filted_data', data.filter(d => (d.iso_code?.length) === 3 && (d.date && d.date > '2022-07-15')))
  })
  // Object.keys(countries.getAlpha2Codes()).forEach((alpha2) => {
  //   stage.resource.loadImage(`https://raw.githubusercontent.com/Jannchie/flagpack/master/flags/1x1/${alpha2.toLowerCase()}.svg`, alpha2);
  // });
  stage.options.sec = 60
  const barChart = new ani.BarChart({
    aniTime: [4, 60],
    dataName: 'filted_data',
    idField: 'iso_code',
    showXAxis: true,
    margin: { top: 100, left: 10, right: 10, bottom: 10 },
    valueField: 'total_vaccinations',
  })

  const map = new ani.MapChart({
    aniTime: [4, 60],
    visualRange: 'total',
    showGraticule: true,
    margin: { top: 100, left: 900, right: 10, bottom: 10 },
    idField: 'iso_code',
    dataName: 'filted_data',
    valueField: 'total_vaccinations',
    showLabel: true,
    projectionType: 'orthographic',
    mapIdField: 'alpha3Code',
    pathShadowBlur: 100,
    pathShadowColor: '#0284c7FF',
    focusTopValueField: 'total_vaccinations',
    useShadow: true,
    focusTop: true,
    visualMap: scaleLinear([1, 0.7, 0.3, 0], ['#0284c7FF', '#0284c744', '#0284c722', '#0284c700'])
      .clamp(true),
  })
  // stage.addChild(map)
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
