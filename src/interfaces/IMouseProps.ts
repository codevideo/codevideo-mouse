import { ReactNode } from 'react';
import { GUIMode, IMouseSnapshot, IAction } from '@fullstackcraftllc/codevideo-types';

export interface IMouseProps {
    mode?: GUIMode;
    actions?: Array<IAction>; // actions to drive the mouse
    setRecordedMouseAction?: (action: IAction) => void; // callback from recording to set mouse actions
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