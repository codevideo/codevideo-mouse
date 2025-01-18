import { JSX } from 'react';
import { MouseAction } from '@fullstackcraftllc/codevideo-types';

export interface IMouseProps {
    mouseActions?: Array<MouseAction>;
    setMouseActions?: (actions: Array<MouseAction>) => void;
    setMouseX?: (x: number) => void;
    setMouseY?: (y: number) => void;
    recording?: boolean;
    replaying?: boolean;
    recordWithTrail?: boolean;
    recordTrailLength?: number;
    replayTrailLength?: number;
    replayWithTrail?: boolean;
    leftClickAnimation?: boolean;
    rightClickAnimation?: boolean;
    customLeftClickAnimation?: () => JSX.Element;
    customRightClickAnimation?: () => JSX.Element;
    interactWithElements?: boolean;
}