import * as React from 'react';
import { IMouseProps } from '../interfaces/IMouseProps';
import { useRecordMousePosition } from '../hooks/useRecordMousePosition';
import { MouseReplay } from './MouseReplay';
import { MouseTrail } from './MouseTrail';
import { useMemo } from 'react';
import { getMouseContextManifest } from '../utils/getMouseContextManifest';

export function Mouse(props: IMouseProps) {
    const { recording, replaying, recordWithTrail, recordTrailLength, replayWithTrail, replayTrailLength, leftClickAnimation, rightClickAnimation, customLeftClickAnimation, customRightClickAnimation } = props;

    const {
        mouseState,
        snapshots,
        trailPoints,
        clearRecording
      } = useRecordMousePosition({
        recording,
        recordWithTrail,
        recordTrailLength,
      });

    // call getMouseContextManifest here on mount - memoized exactly once
    const mouseContextManifest = useMemo(() => getMouseContextManifest(), []);

    return (
        <>
            {!recording && (
                <MouseReplay
                    mouseContextManifest={mouseContextManifest}
                    recording={recording}
                    snapshots={snapshots}
                    currentPosition={mouseState.position}
                    buttonStates={mouseState.buttonStates}
                    onReplayComplete={() => console.log("Replay completed")}
                    leftClickAnimation={leftClickAnimation}
                    rightClickAnimation={rightClickAnimation}
                    // customLeftClickAnimation={customLeftClickAnimation}
                    // customRightClickAnimation={customRightClickAnimation}
              />
            )}
            {recording && recordWithTrail && <MouseTrail points={trailPoints} length={recordTrailLength} />}
        </>
    );
}
