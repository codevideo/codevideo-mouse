import { MouseAction } from "@fullstackcraftllc/codevideo-types";
import { IMouseSnapshot } from "src/interfaces/IMouseSnapshot";

export const convertAbstractedActionToSnapshots = (action: MouseAction): IMouseSnapshot[] => {
    // pull off the value and parse it - it is just a giant JSON array of IMouseSnapshot
    return JSON.parse(action.value) as IMouseSnapshot[]
}