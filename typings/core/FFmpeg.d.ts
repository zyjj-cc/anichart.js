export declare type Preset = "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow" | "slower" | "veryslow" | "placebo ";
export declare function loadffmpeg(): Promise<void>;
export declare function addFrameToFFmpeg(imageData: string, frame: number, name?: string): Promise<void>;
export declare function removePNG(list: string[]): void;
export declare function outputMP4(fps: any, name?: string, preset?: Preset, tune?: string): Promise<void>;
