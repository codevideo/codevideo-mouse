import { useCallback, useEffect, useRef, useState } from "react";
import { IMouseState } from "../interfaces/IMouseSnapshot";
import { IPoint } from "../interfaces/IPoint";
import { IUseMousePositionReturn } from "../interfaces/IUseMousePositionReturn";
import { IMouseSnapshot, MouseAction } from "@fullstackcraftllc/codevideo-types"
import { convertAbstractedActionToSnapshots } from "src/utils/convertAbstractedActionToSnapshots";

export interface IRecordMousePositionProps {
  recording?: boolean;
  mouseActions?: Array<MouseAction>;
  recordWithTrail?: boolean;
  recordTrailLength?: number;
  replayTrailLength?: number;
  setRecordedMouseAction?: (action: MouseAction) => void;
  setRecordedSnapshots?: (snapshots: Array<IMouseSnapshot>) => void;
  setMouseState?: (state: IMouseState) => void;
  clearRecording?:boolean;
}

export const useRecordMousePosition = (
  props: IRecordMousePositionProps
): IUseMousePositionReturn => {
  const {
    recording = false,
    mouseActions = [],
    recordWithTrail = false,
    recordTrailLength = 500,
    replayTrailLength = 500,
    setRecordedMouseAction = () => {},
    setRecordedSnapshots = () => {},
    clearRecording = false,
  } = props;

  // we always need to record the max trail length
  const maxTrailLength = Math.max(recordTrailLength, replayTrailLength);

  const [mouseStateInternal, setMouseStateInternal] = useState<IMouseState>({
    position: { x: 0, y: 0 },
    buttonStates: {
      left: false,
      right: false,
      middle: false,
    },
    scrollPosition: {
      x: 0,
      y: 0
    }
  });

  const [snapshots, setSnapshots] = useState<IMouseSnapshot[]>([]);
  const [trailPoints, setTrailPoints] = useState<IPoint[]>([]);
  const [mouseAction, setMouseAction] = useState<MouseAction>({name: "mouse", value: ""})
  const lastTimeRef = useRef<number>(Date.now());

  const createSnapshot = (
    type: IMouseSnapshot['type'],
    event: MouseEvent | WheelEvent
  ): IMouseSnapshot => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    let button: number | undefined;
    let scrollDelta: number | undefined;

    if (event instanceof MouseEvent && (type === 'down' || type === 'up')) {
      button = event.button;
    }

    if (event instanceof WheelEvent && type === 'scroll') {
      scrollDelta = event.deltaY;
    }

    return {
      x: event instanceof MouseEvent ? event.clientX : mouseStateInternal.position.x,
      y: event instanceof MouseEvent ? event.clientY : mouseStateInternal.position.y,
      timestamp: timeDiff,
      type,
      button,
      buttonStates: { ...mouseStateInternal.buttonStates },
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY
      },
      scrollDelta
    };
  };

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent): void => {
      const newPosition = { x: ev.clientX, y: ev.clientY };

      setMouseStateInternal(prev => ({
        ...prev,
        position: newPosition
      }));

      if (recordWithTrail && recording) {
        setTrailPoints(prev => {
          const newPosition = {
            x: ev.clientX + window.scrollX,
            y: ev.clientY + window.scrollY
          };
          const newPoints = [...prev, newPosition];
          let totalLength = 0;
          let i = newPoints.length - 1;
      
          while (i > 0 && totalLength < maxTrailLength) {
            const dx = newPoints[i].x - newPoints[i - 1].x;
            const dy = newPoints[i].y - newPoints[i - 1].y;
            totalLength += Math.sqrt(dx * dx + dy * dy);
            i--;
          }
      
          return newPoints.slice(Math.max(0, i));
        });
      }

      if (recording) {
        const snapshot = createSnapshot('move', ev);
        setSnapshots(prev => [...prev, snapshot]);
      }
    };

    const handleMouseDown = (ev: MouseEvent): void => {
      const buttonMapping: Record<number, keyof IMouseState['buttonStates']> = {
        0: 'left',
        1: 'middle',
        2: 'right'
      };

      const buttonKey = buttonMapping[ev.button];
      if (!buttonKey) return;

      setMouseStateInternal(prev => ({
        ...prev,
        buttonStates: {
          ...prev.buttonStates,
          [buttonKey]: true
        }
      }));

      if (recording) {
        const snapshot = createSnapshot('down', ev);
        setSnapshots(prev => [...prev, snapshot]);
      }
    };

    const handleMouseUp = (ev: MouseEvent): void => {
      const buttonMapping: Record<number, keyof IMouseState['buttonStates']> = {
        0: 'left',
        1: 'middle',
        2: 'right'
      };

      const buttonKey = buttonMapping[ev.button];
      if (!buttonKey) return;

      setMouseStateInternal(prev => ({
        ...prev,
        buttonStates: {
          ...prev.buttonStates,
          [buttonKey]: false
        }
      }));

      if (recording) {
        const snapshot = createSnapshot('up', ev);
        setSnapshots(prev => [...prev, snapshot]);
      }
    };

    const handleScroll = (ev: WheelEvent): void => {
      setMouseStateInternal(prev => ({
        ...prev,
        scrollPosition: {
          x: window.scrollX,
          y: window.scrollY
        }
      }));

      if (recording) {
        const snapshot = createSnapshot('scroll', ev);
        setSnapshots(prev => [...prev, snapshot]);
      }
    };

    // Prevent context menu from appearing on right click
    const handleContextMenu = (ev: Event): void => {
      ev.preventDefault();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [recording, recordWithTrail, recordTrailLength, replayTrailLength, mouseStateInternal]);

  // every time clearRecording changes, reset this stuff
  useEffect(() => {
    setSnapshots([]);
    setTrailPoints([]);
    lastTimeRef.current = Date.now();
    setMouseAction({name: "mouse", value: ""});
  }, [clearRecording]);

  // any time anything changes, update the mouseAction that we return
  useEffect(() => {
    setMouseAction({
      // use the "abstracted" action name of just "mouse"
      name: "mouse",
      value: JSON.stringify(snapshots)
    })
      
  }, [recording, recordWithTrail, recordTrailLength, replayTrailLength, mouseStateInternal])

  // mouseActions change
  useEffect(() => {
    if (mouseActions && mouseActions.length > 0) {
      // mouse action driver - different ways here is the easy one:
      if (mouseActions.length === 1 && mouseActions[0].name === "mouse") {
        const snapshots = convertAbstractedActionToSnapshots(mouseActions[0]);
        setSnapshots(snapshots);
      } else if (mouseActions.length > 0) {
        // we have composite actions like 'double-click' etc etc.
        alert("codevideo-mouse is only supported as a driver from the single abstracted action name 'mouse', i.e. a JSON with shape [ { name: 'mouse', action: '...' } ]")
        // TODO: finish and activate:
        // convertGranularActionsToSnapshots(mouseActions);
      }
    }
  }, [mouseActions]);

  // any time the mouseAction changes, update the parent
  useEffect(() => {
    if (setRecordedMouseAction) {
      setRecordedMouseAction(mouseAction)
    }
  }, [mouseAction])

  // any time the snapshots change, update the parent
  useEffect(() => {
    if (setRecordedSnapshots) {
      setRecordedSnapshots(snapshots)
    }
  }, [snapshots])

  return {
    mouseState: mouseStateInternal,
    snapshots,
    trailPoints,
    mouseAction,
  };
};