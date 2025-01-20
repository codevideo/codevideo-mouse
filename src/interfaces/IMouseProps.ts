import { ReactNode } from 'react';
import { MouseAction, GUIMode, IMouseSnapshot } from '@fullstackcraftllc/codevideo-types';

export interface IMouseProps {
    mode?: GUIMode;
    mouseActions?: Array<MouseAction>; // mouse actions to drive the mouse
    setRecordedMouseAction?: (action: MouseAction) => void; // callback from recording to set mouse actions
    setRecordedSnapshots?: (state: Array<IMouseSnapshot>) => void; // callback from recording to set mouse state
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