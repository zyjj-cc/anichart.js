import {
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  ScaleLinear,
  interpolateInferno,
  geoOrthographic,
  geoNaturalEarth1,
  geoMercator,
  geoEquirectangular,
  geoPath,
  color,
  extent,
  scaleLinear,
  geoGraticule10,
  geoCentroid,
} from "d3";
import { canvasHelper } from "../CanvasHelper";
import { Component, ShadowOptions } from "../component/Component";
import { Path } from "../component/Path";
import { Rect } from "../component/Rect";
import { Text } from "../component/Text";
import { recourse } from "../Recourse";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface MapChartOptions extends BaseChartOptions {
  labelAlphaScale?: ScaleLinear<number, number, never>;
  labelPadding?: number;
  labelSize?: number;
  pathShadowBlur?: number;
  pathShadowColor?: string;
  useShadow?: boolean;
  showGraticule?: boolean;
  margin?: { top: number; left: number; right: number; bottom: number };
  projectionType?: "orthographic" | "natural" | "mercator" | "equirectangular";
  mapIdField?: string;
  visualMap?: (t: number) => string;
  getMapId?: (id: string) => string;
  strokeStyle?: string;
  defaultFill?: string | CanvasGradient | CanvasPattern;

  noDataLabel?: string;
  showLabel?: boolean;
}
export class MapChart extends BaseChart {
  geoGener: GeoPath<any, GeoPermissibleObjects>;
  pathMap: Map<string, string | null>;
  pathComponentMap: Map<string, Path>;
  labelComponentMap: Map<string, Component>;
  projection: GeoProjection;
  map: any;
  mapIdField: string;
  visualMap: (t: number) => string;
  noDataLabel: string | undefined | null;
  getMapId: (id: string) => string;
  strokeStyle: string;
  defaultFill: string | CanvasGradient | CanvasPattern;
  projectionType: "orthographic" | "natural" | "mercator" | "equirectangular";
  scale: ScaleLinear<number, number, never>;
  showGraticule: boolean;
  graticulePath: string;
  graticulePathComp: Path;

  pathShadowBlur: number;
  pathShadowColor: string | undefined;
  useShadow: boolean;
  showLabel: boolean;
  labelPadding: number;
  labelSize: any;
  labelAlphaScale: ScaleLinear<number, number, never>;

  constructor(options?: MapChartOptions) {
    super(options);
    if (!options) options = {};
    this.margin = options?.margin ?? {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    };
    this.visualMap = options.visualMap ?? interpolateInferno;
    this.getMapId = options.getMapId ?? ((id) => id);
    this.mapIdField = options.mapIdField ?? "alpha3Code";
    this.strokeStyle = options.strokeStyle ?? "#FFF";
    this.defaultFill = options.defaultFill ?? "#FFF1";
    this.projectionType = options.projectionType ?? "natural";
    this.useShadow = options.useShadow ?? false;
    this.pathShadowColor = options.pathShadowColor;
    this.pathShadowBlur = options.pathShadowBlur ?? 100;
    this.showGraticule = options.showGraticule ?? false;
    this.showLabel = options.showLabel ?? false;
    this.noDataLabel = options.noDataLabel ?? undefined;
    this.labelPadding = options.labelPadding ?? 8;
    this.labelSize = options.labelSize ?? 12;
    if (options.labelFormat) this.labelFormat = options.labelFormat;
    this.labelAlphaScale =
      options.labelAlphaScale ?? scaleLinear([400, 560], [0, 1]).clamp(true);
  }
  margin: { top: number; left: number; right: number; bottom: number };
  setup(stage: Stage) {
    super.setup(stage);
    if (stage) {
      const map = recourse.data.get("map");
      let projection: GeoProjection;
      switch (this.projectionType) {
        case "orthographic":
          projection = geoOrthographic();
          break;
        case "natural":
          projection = geoNaturalEarth1();
          break;
        case "mercator":
          projection = geoMercator();
          break;
        case "equirectangular":
          projection = geoEquirectangular();
        default:
          projection = geoNaturalEarth1();
      }
      projection.fitExtent(
        [
          [this.margin.left, this.margin.top],
          [
            stage.canvas.width - this.margin.right,
            stage.canvas.height - this.margin.bottom,
          ],
        ],
        map
      );

      this.projection = projection;
      this.map = map;
      this.init(projection, map);
    }
  }
  wrapper: Component;
  private init(projection: GeoProjection, map: any) {
    this.initGeoPath(projection, map);
    this.initComps();
  }

  private initGeoPath(projection: GeoProjection, map: any) {
    const geoGener = geoPath(projection);
    this.geoGener = geoGener;
    this.pathMap = new Map<string, string>();
    this.initPathMap(map, geoGener);
  }

  labelFormat = (id: string) => {
    return id;
  };
  private initPathMap(map: any, geoGener: GeoPath<any, GeoPermissibleObjects>) {
    this.labelComponentMap = new Map<string, Component>();
    for (const feature of map.features) {
      const mapId = feature.properties[this.mapIdField];
      const path = geoGener(feature);
      this.pathMap.set(mapId, path);
      const txt = new Text({
        position: { x: 4, y: 6 },
        text: this.labelFormat(feature.properties[this.mapIdField]),
        textAlign: "left",
        textBaseline: "top",
        fillStyle: this.strokeStyle,
        fontSize: this.labelSize,
      });
      const width = canvasHelper.measure(txt).width;
      const label = new Rect({
        position: { x: 0, y: 0 },
        fillStyle: "#2225",
        strokeStyle: this.strokeStyle,
        shape: {
          width: width + this.labelPadding,
          height: this.labelSize + this.labelPadding,
        },
      });
      label.addChild(txt);
      this.labelComponentMap.set(mapId, label);
    }
  }
  private initComps() {
    this.wrapper = new Component();
    this.pathComponentMap = new Map<string, Path>();

    this.pathMap.forEach((p, mapId) => {
      const path = new Path({
        path: p,
        fillStyle: this.defaultFill,
        strokeStyle: this.strokeStyle,
      });
      this.wrapper.children.push(path);
      this.pathComponentMap.set(mapId, path);
    });
    if (this.showLabel) {
      for (const labelComp of this.labelComponentMap.values()) {
        this.wrapper.children.push(labelComp);
      }
    }
    if (this.showGraticule) {
      const stroke = color(this.strokeStyle);
      if (stroke) {
        stroke.opacity = 0.25;
      }
      this.graticulePathComp = new Path({
        path: this.graticulePath,
        strokeStyle: stroke?.toString(),
        fillStyle: "#0000",
      });
      this.wrapper.children.push(this.graticulePathComp);
    }
  }

  getComponent(sec: number) {
    this.updateScale(sec);
    this.updateProject(sec);
    this.updatePath(sec);
    return this.wrapper;
  }
  updateScale(sec: number) {
    [this.currentMin, this.currentMax] = extent(
      this.getCurrentData(sec),
      (d) => d[this.valueField]
    );
    if (this.currentMax > this.historyMax) {
      this.historyMax = this.currentMax;
    }
    if (this.historyMin > this.currentMin) {
      this.historyMin = this.currentMax;
    }
    if (!this.visualRange || typeof this.visualRange === "string") {
      switch (this.visualRange) {
        case "total":
          this.scale = scaleLinear(
            [this.totallyMin, this.totallyMax],
            [0, 1]
          ).clamp(true);
          break;
        case "history":
          this.scale = scaleLinear(
            [this.historyMin, this.historyMax],
            [0, 1]
          ).clamp(true);
        default:
          this.scale = scaleLinear(
            [this.currentMin, this.currentMax],
            [0, 1]
          ).clamp(true);
          break;
      }
    } else {
      this.scale = scaleLinear(this.visualRange, [0, 1]).clamp(true);
    }
  }
  updatePath(sec: number) {
    if (this.showGraticule) {
      const graticulePath = this.geoGener(geoGraticule10());
      if (graticulePath) {
        this.graticulePathComp.path = graticulePath;
      }
    }
    for (const feature of this.map.features) {
      const mapId = feature.properties[this.mapIdField];
      const path = this.geoGener(feature);
      const comp = this.pathComponentMap.get(mapId);
      if (comp && path) {
        comp.path = path;
      }
      const label = this.labelComponentMap.get(mapId);
      if (label) {
        const center = this.geoGener.centroid(feature);
        const area = this.geoGener.area(feature);
        label.alpha = path ? this.labelAlphaScale(area) : 0;
        label.position.x = center[0];
        label.position.y = center[1];
      }
      if (label) {
        (label.children[0] as Text).text =
          this.dataScales?.get(mapId)?.(sec)[this.valueField] ||
          !this.noDataLabel
            ? this.labelFormat(mapId)
            : this.noDataLabel;

        const width = canvasHelper.measure(label.children[0] as Text).width;
        (label as Rect).shape.width = width + this.labelPadding;
      }
    }
    for (const [id, data] of this.dataScales) {
      const mapId = this.getMapId(id);
      const currentValue = data(sec)[this.valueField];
      const rate = this.scale(currentValue);
      const color = this.visualMap(rate);
      const comp = this.pathComponentMap.get(mapId);

      if (comp) {
        comp.fillStyle = currentValue ? color : this.defaultFill;
        if (this.useShadow) {
          comp.shadow = {
            enable: true,
            blur: this.pathShadowBlur * rate + 1,
            color: this.pathShadowColor ?? color,
          } as ShadowOptions;
        }
      }
    }
  }

  updateProject(sec: number) {
    this.projection.rotate([sec * 20, 0]);
  }
}
