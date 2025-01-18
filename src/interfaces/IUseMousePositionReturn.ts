import { IMouseSnapshot, IMouseState } from "./IMouseSnapshot";
import { IPoint } from "./IPoint";

export interface IUseMousePositionReturn {
  mouseState: IMouseState;
  snapshots: IMouseSnapshot[];
  trailPoints: IPoint[];
  clearRecording: () => void;
}
