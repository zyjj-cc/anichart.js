import { canvasHelper } from './../CanvasHelper'
import {
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  geoOrthographic,
  geoNaturalEarth1,
  geoMercator,
  geoEquirectangular,
  geoPath,
  geoGraticule10,
} from 'd3-geo'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { color } from 'd3-color'
import { interpolateInferno } from 'd3-scale-chromatic'
import { extent, range } from 'd3-array'
import { Component } from '../component/Component'
import { Path } from '../component/Path'
import { Rect } from '../component/Rect'
import { Text } from '../component/Text'
import { Stage } from '../Stage'
import { BaseChart, BaseChartOptions } from './BaseChart'
import { Ani } from '../ani/Ani'
import KalmanFilter, { KalmanFilterOptions } from '../utils/KalmanFilter'
interface UpdateProjectionProps { chart: MapChart, sec: number }
interface MapChartOptions extends BaseChartOptions {
  labelAlphaScale?: ScaleLinear<number, number, never>
  labelPadding?: number
  labelSize?: number
  pathShadowBlur?: number
  pathShadowColor?: string
  useShadow?: boolean
  showGraticule?: boolean
  projectionType?: 'orthographic' | 'natural' | 'mercator' | 'equirectangular'
  mapIdField?: string
  visualMap?: (t: number) => string
  getMapId?: (id: string) => string
  strokeStyle?: string
  defaultFill?: string | CanvasGradient | CanvasPattern
  noDataLabel?: string
  showLabel?: boolean
  updateProjection?: (data: UpdateProjectionProps) => void
  focusTop?: boolean
  focusTopKfOptions?: KalmanFilterOptions
}
export class MapChart extends BaseChart {
  private geoGener: GeoPath<any, GeoPermissibleObjects>
  private pathMap: Map<string, string | null>
  private pathComponentMap: Map<string, Path>
  private labelComponentMap: Map<string, Component>
  private projection: GeoProjection
  private map: any
  private graticulePathComp: Path
  private defaultFill: string | CanvasGradient | CanvasPattern
  private scale: ScaleLinear<number, number, never>
  private readonly mapIdField: string
  private readonly visualMap: (t: number, value: number) => string
  private readonly noDataLabel: string | undefined | null
  private readonly getMapId: (id: string) => string
  private readonly strokeStyle: string
  private readonly projectionType: 'orthographic' | 'natural' | 'mercator' | 'equirectangular'
  private readonly showGraticule: boolean
  private readonly graticulePath: string
  private readonly pathShadowBlur: number
  private readonly pathShadowColor: string
  private readonly useShadow: boolean
  private readonly showLabel: boolean
  private readonly labelPadding: number
  private readonly labelSize: number
  private readonly labelAlphaScale: ScaleLinear<number, number, never>
  private readonly propertiesMap: Map<string, any> = new Map<string, any>()
  private readonly focusTop: boolean
  private readonly focusTopKfOptions: KalmanFilterOptions = { R: 0.1, Q: 5 }

  updateProjection: ((props: UpdateProjectionProps) => void) = (props) => {
    props.chart.projection.rotate([props.sec, 0, 0])
  }

  constructor (options: MapChartOptions = {}) {
    super(options)
    this.margin = options?.margin ?? {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    }
    this.visualMap = options.visualMap ?? interpolateInferno
    this.getMapId = options.getMapId ?? ((id) => id)
    this.mapIdField = options.mapIdField ?? 'alpha3Code'
    this.strokeStyle = options.strokeStyle ?? '#FFF'

    if (options.defaultFill) {
      this.defaultFill = options.defaultFill
    }

    this.projectionType = options.projectionType ?? 'natural'
    this.useShadow = options.useShadow ?? false
    this.pathShadowColor = options.pathShadowColor ?? '#fff2'
    this.pathShadowBlur = options.pathShadowBlur ?? 100
    this.showGraticule = options.showGraticule ?? false
    this.showLabel = options.showLabel ?? false
    this.noDataLabel = options.noDataLabel ?? undefined
    this.labelPadding = options.labelPadding ?? 8
    this.labelSize = options.labelSize ?? 12
    if (options.focusTopKfOptions) {
      this.focusTopKfOptions = options.focusTopKfOptions
    }
    if (options.labelFormat != null) this.labelFormat = options.labelFormat
    this.labelAlphaScale =
      options.labelAlphaScale ?? scaleLinear([400, 560], [0, 1]).clamp(true)
    if (!options.focusTop && options.updateProjection) {
      this.updateProjection = options.updateProjection
    }
    this.focusTop = options.focusTop ?? false
  }

  margin: { top: number, left: number, right: number, bottom: number }
  async setup (stage: Stage, parent: Ani) {
    await super.setup(stage, parent)

    if (stage) {
      const map = this.stage?.resource.data.get('map')
      let projection: GeoProjection
      switch (this.projectionType) {
        case 'orthographic':
          projection = geoOrthographic()
          break
        case 'natural':
          projection = geoNaturalEarth1()
          break
        case 'mercator':
          projection = geoMercator()
          break
        case 'equirectangular':
          projection = geoEquirectangular()
          break
        default:
          projection = geoNaturalEarth1()
      }
      projection.fitExtent(
        [
          [this.margin.left, this.margin.top],
          [
            stage.canvas.width - this.margin.right,
            stage.canvas.height - this.margin.bottom,
          ],
        ],
        map,
      )

      this.projection = projection
      this.map = map
      await this.initDefaultFill()
      this.init(projection, map)
    }
  }

  private wrapper: Component
  private async initDefaultFill () {
    const svgStr = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L0 20H10L20 10V0Z" fill="#4444"/><path d="M10 0H0V10L10 0Z" fill="#4444"/></svg>'
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = await this.stage?.resource.loadImage(url, '_map_default_pattern')
    if (img != null) {
      const ptn = canvasHelper.getPattern(img)
      this.defaultFill = ptn
    }
  }

  private init (projection: GeoProjection, map: any) {
    this.initGeoPath(projection, map)
    this.initComps()
    if (this.focusTop) {
      const secRange = range(
        0,
        this.stage?.options.sec ?? 10,
        0.1, // every  sec
      )
      const centerRange = secRange.map((sec) => this.propertiesMap.get(this.getCurrentData(sec)[0][this.idField]).center)
      const kfx = new KalmanFilter(this.focusTopKfOptions)
      const kfy = new KalmanFilter(this.focusTopKfOptions)
      const centerData: Array<[number, number]> = []
      centerRange.forEach(center => {
        const x = kfx.filter(center[0])
        centerData.push([x, kfy.filter(center[1])])
      })
      const centerScale = scaleLinear(secRange, centerData).clamp(true)
      this.updateProjection = (props) => {
        const center = centerScale(props.sec)
        props.chart.projection.rotate([-center[0], -center[1], 0])
      }
    }
  }

  private initGeoPath (projection: GeoProjection, map: any) {
    const geoGener = geoPath(projection)
    this.geoGener = geoGener
    this.pathMap = new Map<string, string>()
    this.initPathMap(map, geoGener)
  }

  labelFormat = (id: string, meta: any, data: any) => {
    return id
  }

  private initPathMap (map: any, geoGener: GeoPath<any, GeoPermissibleObjects>) {
    this.labelComponentMap = new Map<string, Component>()
    for (const feature of map.features) {
      this.propertiesMap.set(feature.properties[this.mapIdField], feature.properties)
      const mapId: string = feature.properties[this.mapIdField]
      const path = geoGener(feature)
      this.pathMap.set(mapId, path)
      if (!feature.properties[this.mapIdField]) continue
      const txt = new Text({
        key: `map-text-${mapId}`,
        position: { x: 4, y: 6 },
        text: this.labelFormat(
          feature.properties[this.mapIdField],
          this.meta,
          this.dataGroupByID,
        ),
        textAlign: 'left',
        textBaseline: 'top',
        fillStyle: this.strokeStyle,
        fontSize: this.labelSize,
      })
      const width = canvasHelper.measure(txt).width
      const label = new Rect({
        key: `map-label-${mapId}`,
        position: { x: 0, y: 0 },
        fillStyle: '#2225',
        strokeStyle: this.strokeStyle,
        shape: {
          width: width + this.labelPadding,
          height: this.labelSize + this.labelPadding,
        },
      })
      label.addChild(txt)
      this.labelComponentMap.set(mapId, label)
    }
  }

  private initComps () {
    this.wrapper = new Component({
      key: 'map-wrapper',
    })
    this.pathComponentMap = new Map<string, Path>()

    this.pathMap.forEach((p, mapId) => {
      const path = new Path({
        key: `map-path-${mapId}`,
        path: p,
        fillStyle: this.defaultFill,
        strokeStyle: this.strokeStyle,
      })
      this.wrapper.children.push(path)
      this.pathComponentMap.set(mapId, path)
    })
    if (this.showLabel) {
      for (const labelComp of this.labelComponentMap.values()) {
        this.wrapper.children.push(labelComp)
      }
    }
    if (this.showGraticule) {
      const stroke = color(this.strokeStyle)
      if (stroke != null) {
        stroke.opacity = 0.25
      }
      this.graticulePathComp = new Path({
        key: 'map-graticule',
        path: this.graticulePath,
        strokeStyle: stroke?.toString(),
        fillStyle: '#0000',
      })
      this.wrapper.children.push(this.graticulePathComp)
    }
  }

  getComponent (sec: number) {
    this.updateScale(sec)
    this.updateProject({ sec, chart: this })
    this.updatePath(sec)
    return this.wrapper
  }

  updateScale (sec: number) {
    [this.currentMin, this.currentMax] = extent(
      this.getCurrentData(sec),
      (d) => d[this.valueField],
    )
    if (this.currentMax > this.historyMax) {
      this.historyMax = this.currentMax
    }
    if (this.historyMin > this.currentMin) {
      this.historyMin = this.currentMax
    }
    if (!this.visualRange || typeof this.visualRange === 'string') {
      switch (this.visualRange) {
        case 'total':
          this.scale = scaleLinear(
            [this.totallyMin, this.totallyMax],
            [0, 1],
          ).clamp(true)
          break
        case 'history':
          this.scale = scaleLinear(
            [this.historyMin, this.historyMax],
            [0, 1],
          ).clamp(true)
          break
        default:
          this.scale = scaleLinear(
            [this.currentMin, this.currentMax],
            [0, 1],
          ).clamp(true)
      }
    } else {
      this.scale = scaleLinear(this.visualRange, [0, 1]).clamp(true)
    }
  }

  updatePath (sec: number) {
    if (this.showGraticule) {
      const graticulePath = this.geoGener(geoGraticule10())
      if (graticulePath) {
        this.graticulePathComp.path = graticulePath
      }
    }
    for (const feature of this.map.features) {
      const mapId = feature.properties[this.mapIdField]
      if (mapId === 'undefined') continue
      const path = this.geoGener(feature)
      const comp = this.pathComponentMap.get(mapId)
      if (comp != null) {
        comp.path = path
      }
      const label = this.labelComponentMap.get(mapId)
      if (label != null) {
        // Read center point of country
        let cp: [number, number]
        if (feature.properties.cp) cp = feature.properties.cp
        else cp = feature.properties.center
        const center = this.projection(cp)
        const area = this.geoGener.area(feature)
        label.alpha = path ? this.labelAlphaScale(area) : 0
        if (center != null) {
          label.position.x = center[0]
          label.position.y = center[1]
        } else {
          label.alpha = 0
        }
      }
      if (label != null) {
        (label.children[0] as Text).text =
          this.dataScales?.get(mapId)?.(sec)[this.valueField] ||
          !this.noDataLabel
            ? this.labelFormat(mapId, this.meta, this.dataGroupByID)
            : this.noDataLabel

        const width = canvasHelper.measure(label.children[0] as Text).width;
        (label as Rect).shape.width = width + this.labelPadding
      }
    }
    for (const [id, data] of this.dataScales) {
      const mapId = this.getMapId(id)
      const currentValue = data(sec)[this.valueField]
      const rate = this.scale(currentValue)
      const color = this.visualMap(rate, currentValue)
      const comp = this.pathComponentMap.get(mapId)
      if (comp != null) {
        comp.fillStyle = currentValue ? color : this.defaultFill
        if (this.useShadow) {
          comp.shadow = {
            enable: true,
            blur: this.pathShadowBlur * rate + 1,
            color: this.pathShadowColor ?? color,
          }
        }
      }
    }
  }

  updateProject (data: UpdateProjectionProps) {
    if (this.updateProjection) {
      this.updateProjection(data)
    }
  }
}
