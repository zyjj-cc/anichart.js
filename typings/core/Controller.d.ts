import { Stage } from "./Stage";
export declare class Controller {
    stage: Stage;
    constructor(stage: Stage);
    render(): void;
    makeDraggable(contentID: string, draggerID: string): void;
    play(): void;
}
