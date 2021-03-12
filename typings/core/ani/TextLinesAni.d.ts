import { Text } from "../component/Text";
import { Ani } from "./Ani";
export declare class TextLinesAni extends Ani {
    component: Text;
    lineSpacing: number;
    children: Text[];
    getComponent(sec: number): Text;
}
