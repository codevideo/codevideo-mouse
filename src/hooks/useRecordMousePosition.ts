import { useEffect, useRef, useState } from "react";
import { IMouseSnapshot, IMouseState } from "../interfaces/IMouseSnapshot";
import { IPoint } from "../interfaces/IPoint";
import { IUseMousePositionReturn } from "../interfaces/IUseMousePositionReturn";

export interface IRecordMousePositionProps {
  recording?: boolean;
  recordWithTrail?: boolean;
  recordTrailLength?: number;
}

export const useRecordMousePosition = (
  props: IRecordMousePositionProps
): IUseMousePositionReturn => {
  const { 
    recording = false, 
    recordWithTrail = false, 
    recordTrailLength = 500 
  } = props;

  const [mouseState, setMouseState] = useState<IMouseState>({
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
      x: event instanceof MouseEvent ? event.clientX : mouseState.position.x,
      y: event instanceof MouseEvent ? event.clientY : mouseState.position.y,
      timestamp: timeDiff,
      type,
      button,
      buttonStates: { ...mouseState.buttonStates },
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
      
      setMouseState(prev => ({
        ...prev,
        position: newPosition
      }));

      if (recordWithTrail) {
        setTrailPoints(prev => {
          const newPoints = [...prev, newPosition];
          let totalLength = 0;
          let i = newPoints.length - 1;

          while (i > 0 && totalLength < recordTrailLength) {
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

      setMouseState(prev => ({
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

      setMouseState(prev => ({
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
      setMouseState(prev => ({
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
  }, [recording, recordWithTrail, recordTrailLength, mouseState]);

  const clearRecording = (): void => {
    setSnapshots([]);
    setTrailPoints([]);
    lastTimeRef.current = Date.now();
  };

  return {
    mouseState,
    snapshots,
    trailPoints,
    clearRecording
  };
};