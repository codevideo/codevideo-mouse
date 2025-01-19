import { ReactNode } from 'react';
import { MouseAction, GUIMode } from '@fullstackcraftllc/codevideo-types';
import { IMouseState } from './IMouseSnapshot';

export interface IMouseProps {
    mode?: GUIMode;
    mouseActions?: Array<MouseAction>; // mouse actions to drive the mouse
    setRecordedMouseAction?: (action: MouseAction) => void; // callback from recording to set mouse actions
    setMouseState?: (state: IMouseState) => void; // callback from recording to set mouse state
    clearRecording?: boolean;
    recordWithTrail?: boolean;
    recordTrailLength?: number;
    replayTrailLength?: number;
    replayWithTrail?: boolean;
    onReplayComplete?: () => void;
    leftClickAnimation?: boolean;
    rightClickAnimation?: boolean;
    customLeftClickAnimation?: ReactNode;
    customRightClickAnimation?: ReactNode;
    interactWithElements?: boolean;
}