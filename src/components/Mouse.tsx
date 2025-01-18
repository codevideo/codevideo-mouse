import * as React from 'react';
import { IMouseProps } from '../interfaces/IMouseProps';
import { useRecordMousePosition } from '../hooks/useRecordMousePosition';
import { MouseReplay } from './MouseReplay';
import { MouseTrail } from './MouseTrail';
import { useEffect, useMemo } from 'react';
import { getMouseContextManifest } from '../utils/getMouseContextManifest';

export function Mouse(props: IMouseProps) {
  const {
    recording,
    clearRecording,
    mouseActions,
    setRecordedMouseAction,
    replaying,
    recordWithTrail,
    recordTrailLength,
    replayWithTrail, 
    replayTrailLength, 
    onReplayComplete,
    leftClickAnimation, 
    rightClickAnimation, 
    customLeftClickAnimation, 
    customRightClickAnimation 
  } = props;

  // call getMouseContextManifest here on mount - memoized exactly once
  const mouseContextManifest = useMemo(() => getMouseContextManifest(), []);

  const {
    mouseState,
    snapshots,
    trailPoints,
    mouseAction,
  } = useRecordMousePosition({
    recording,
    recordWithTrail,
    recordTrailLength,
    replayTrailLength,
    clearRecording
  });

  // TODO: better pattern to pass setRecordedMouseAction directly into the hook above?
  useEffect(() => {
    if (setRecordedMouseAction) {
      setRecordedMouseAction(mouseAction)
    }
  }, [mouseAction])

  return (
    <>
      <MouseReplay
        mouseContextManifest={mouseContextManifest}
        mouseActions={mouseActions}
        replaying={replaying}
        snapshots={snapshots}
        currentPosition={mouseState.position}
        buttonStates={mouseState.buttonStates}
        onReplayComplete={onReplayComplete}
        leftClickAnimation={leftClickAnimation}
        rightClickAnimation={rightClickAnimation}
        customLeftClickAnimation={customLeftClickAnimation}
        customRightClickAnimation={customRightClickAnimation}
      />
      {recording && recordWithTrail && <MouseTrail points={trailPoints} length={recordTrailLength} />}
      {replaying && replayWithTrail && <MouseTrail points={trailPoints} length={replayTrailLength} />}
    </>
  );
}
