export declare class Recourse {
    constructor();
    setup(): Promise<any[]>;
    private imagesPromise;
    images: Map<string, CanvasImageSource>;
    private dataPromise;
    data: Map<string, any>;
    loadImage(path: string, name?: string): Promise<HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas | null>;
    loadCSV(path: string | any, name: string): Promise<unknown>;
    loadJSON(path: string | any, name: string): Promise<unknown>;
}
export declare const recourse: Recourse;
