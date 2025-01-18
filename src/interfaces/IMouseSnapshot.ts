import { IPoint } from "./IPoint";

export interface IMouseSnapshot extends IPoint {
  x: number;
  y: number;
  timestamp: number;
  type: 'move' | 'down' | 'up' | 'scroll';
  button?: number;    // 0: left, 1: middle, 2: right
  buttonStates: {
    left: boolean;
    right: boolean;
    middle: boolean;
  };
  scrollPosition: {
    x: number;
    y: number;
  };
  scrollDelta?: number;
}

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

