import { IMouseSnapshot, IPoint } from "@fullstackcraftllc/codevideo-types";

export interface IMouseState {
  position: IPoint;
  buttonStates: {
    left: boolean;
    right: boolean;
    middle: boolean;
  };
  scrollPosition: {
    x: number;
    y: number;
  };
}

export interface IUseMousePositionReturn {
  mouseState: IMouseState;
  snapshots: IMouseSnapshot[];
  trailPoints: IPoint[];
  clearRecording: () => void;
}

export interface IRecordMousePositionProps {
  recording?: boolean;
  recordWithTrail?: boolean;
  recordTrailLength?: number;
}

