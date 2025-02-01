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
    actions,
    setRecordedMouseAction,
    setRecordedSnapshots,
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
    snapshots,
    trailPoints,
  } = useRecordMousePosition({
    recording,
    actions,
    recordWithTrail,
    recordTrailLength,
    replayTrailLength,
    setRecordedMouseAction,
    setRecordedSnapshots,
    clearRecording
  });

  useEffect(() => {
    if (mode === 'record') {
      setRecording(true);
    } else {
      setRecording(false);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'replay') {
      setReplaying(true);
    } else {
      setReplaying(false);
    }
  }, [mode]);

  // a change in mouseActions forces replay
  useEffect(() => {
    if (actions && actions.length > 0) {
      // Stop any ongoing recording
      setRecording(false);
      // Start replaying
      setReplaying(true);
    }
  }, [actions]);

  // don't render anything if we are not recording or replaying
  if (!recording && !replaying) {
    return <></>;
  }

  return (
    <>
      <MouseReplay
        mouseContextManifest={mouseContextManifest}
        replaying={replaying}
        snapshots={snapshots}
        onReplayComplete={onReplayComplete}
        leftClickAnimation={leftClickAnimation}
        rightClickAnimation={rightClickAnimation}
        customLeftClickAnimation={customLeftClickAnimation}
        customRightClickAnimation={customRightClickAnimation}
      />
      {recordWithTrail && <MouseTrail recording={recording} replaying={replaying} points={trailPoints} />}
      {/* TODO: handle replay with trail */}
      {/* {replayWithTrail && <MouseTrail recording={recording} replaying={replaying} points={trailPoints} />} */}
    </>
  );
}
