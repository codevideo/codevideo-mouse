import { IMouseSnapshot, MouseAction } from "@fullstackcraftllc/codevideo-types";

export const convertGranularActionsToSnapshots = (actions: MouseAction[]): IMouseSnapshot[] => {
    // for each action, rebuild a mouse snapshot
    // also ensure that state is preserved from 0 to n actions....
    return actions.map(action => {
        return {
            x: 0,
            y: 0,
            timestamp: 0,
            type: 'move',
            buttonStates: {
                left: false,
                right: false,
                middle: false,
            },
            scrollPosition: {
                x: 0,
                y: 0,
            },
            scrollDelta: 0,
        }
    })
}