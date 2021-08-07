import { FFmpeg } from "@ffmpeg/ffmpeg";
export declare type Preset = "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow" | "slower" | "veryslow" | "placebo ";
export declare function loadffmpeg(ffmpeg: FFmpeg): Promise<void>;
export declare function addFrameToFFmpeg(ffmpeg: FFmpeg, imageData: string, frame: number, name?: string): Promise<void>;
export declare function removePNG(ffmpeg: FFmpeg, list: string[]): void;
export declare function outputMP4(ffmpeg: FFmpeg, fps: any, name?: string, preset?: Preset, tune?: string): Promise<void>;
