import { ReactNode } from 'react';
import { MouseAction } from '@fullstackcraftllc/codevideo-types';

export interface IMouseProps {
    mouseActions?: Array<MouseAction>; // mouse actions to drive the mouse
    setRecordedMouseAction?: (action: MouseAction) => void; // callback from recording to set mouse actions
    setMouseX?: (x: number) => void;
    setMouseY?: (y: number) => void;
    recording?: boolean;
    clearRecording?: boolean;
    replaying?: boolean;
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