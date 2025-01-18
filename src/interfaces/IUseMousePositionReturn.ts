import { MouseAction } from "@fullstackcraftllc/codevideo-types";
import { IMouseSnapshot, IMouseState } from "./IMouseSnapshot";
import { IPoint } from "./IPoint";

export interface IUseMousePositionReturn {
  mouseState: IMouseState;
  snapshots: IMouseSnapshot[];
  trailPoints: IPoint[];
  mouseAction: MouseAction // one big mouse action that is built from the recording
}
