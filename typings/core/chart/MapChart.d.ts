import { GeoPath, GeoPermissibleObjects, GeoProjection, ScaleLinear } from "d3";
import { Component } from "../component/Component";
import { Path } from "../component/Path";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface MapChartOptions extends BaseChartOptions {
    pathShadowBlur?: number;
    pathShadowColor?: string;
    useShadow?: boolean;
    showGraticule?: boolean;
    margin?: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    projectionType?: "orthographic" | "natural" | "mercator" | "equirectangular";
    mapIdField?: string;
    visualMap?: (t: number) => string;
    getMapId?: (id: string) => string;
    strokeStyle?: string;
    defaultFill?: string;
}
export declare class MapChart extends BaseChart {
    geoGener: GeoPath<any, GeoPermissibleObjects>;
    pathMap: Map<string, string | null>;
    pathComponentMap: Map<string, Path>;
    projection: GeoProjection;
    map: any;
    mapIdField: string;
    visualMap: (t: number) => string;
    getMapId: (id: string) => string;
    strokeStyle: string;
    defaultFill: string;
    projectionType: "orthographic" | "natural" | "mercator" | "equirectangular";
    scale: ScaleLinear<number, number, never>;
    showGraticule: boolean;
    graticulePath: string;
    graticulePathComp: Path;
    pathShadowBlur: number;
    pathShadowColor: string | undefined;
    useShadow: boolean;
    constructor(options?: MapChartOptions);
    margin: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    setup(stage: Stage): void;
    wrapper: Component;
    private init;
    private initGeoPath;
    private initPathMap;
    private initComps;
    getComponent(sec: number): Component;
    updateScale(sec: number): void;
    updatePath(sec: number): void;
    updateProject(sec: number): void;
}
export {};
