import * as React from 'react';
import { IMouseProps } from '../interfaces/IMouseProps';
import { useRecordMousePosition } from '../hooks/useRecordMousePosition';
import { MouseReplay } from './MouseReplay';
import { MouseTrail } from './MouseTrail';
import { useEffect, useMemo, useState } from 'react';
import { getMouseContextManifest } from '../utils/getMouseContextManifest';

export function Mouse(props: IMouseProps) {
  const {
    mode,
    clearRecording,
    mouseActions,
    setRecordedMouseAction,
    setMouseState,
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
  const [recording, setRecording] = useState(mode === 'record');
  const [replaying, setReplaying] = useState(mode === 'replay');

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
    setRecordedMouseAction,
    setMouseState,
    clearRecording
  });

  useEffect(() => {
    if (mode === 'record') {
      setRecording(true);
    } else {
      setRecording(false);
    }
  } , [mode]);

  useEffect(() => {
    if (mode === 'replay') {
      setReplaying(true);
    } else {
      setReplaying(false);
    }
  } , [mode]);

  // a change in mouseActions forces replay
  useEffect(() => {
    if (mouseActions && mouseActions.length > 0) {
      // Stop any ongoing recording
      setRecording(false);
      // Start replaying
      setReplaying(true);
    }
  }, [mouseActions]);

  // don't render anything if we are not recording or replaying
  if (!recording && !replaying) {
    return <></>;
  }

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
