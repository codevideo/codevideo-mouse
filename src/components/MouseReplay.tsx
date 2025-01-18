import { cloneElement, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { IMouseSnapshot } from "../interfaces/IMouseSnapshot";
import { IPoint } from "../interfaces/IPoint";
import { DefaultCursor } from "./cursors/DefaultCursor";
import { PointerCursor } from "./cursors/PointerCursor";
import { TextSelectCursor } from "./cursors/TextSelectCursor";
import { IMouseContextManifest } from "../interfaces/IMouseContextManifest";

export interface IMouseReplayProps {
  mouseContextManifest: Array<IMouseContextManifest>;
  snapshots: IMouseSnapshot[];
  currentPosition: IPoint;
  buttonStates: {
    left: boolean;
    right: boolean;
    middle: boolean;
  };
  onReplayComplete?: () => void;
  recording?: boolean;
  leftClickAnimation?: boolean;
  rightClickAnimation?: boolean;
  customLeftClickAnimation?: ReactNode;
  customRightClickAnimation?: ReactNode;
}

export const MouseReplay = (props: IMouseReplayProps) => {
  const { 
    mouseContextManifest,
    snapshots,
    currentPosition,
    onReplayComplete,
    leftClickAnimation,
    rightClickAnimation,
    customLeftClickAnimation,
    customRightClickAnimation
  } = props;
  const [replayPosition, setReplayPosition] = useState<IPoint | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string>("default");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeClickAnimations, setActiveClickAnimations] = useState<Array<{
    id: number;
    x: number;
    y: number;
    type: 'left' | 'right';
    timestamp: number;
  }>>([]);
  const timeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  let clickAnimationId = useRef(0);

  const stopPlayback = (): void => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
    setReplayPosition(null);
    setCurrentCursor("default");
    setActiveClickAnimations([]);
  };

  const addClickAnimation = (x: number, y: number, button: number) => {
    if ((button === 0 && !leftClickAnimation) || (button === 2 && !rightClickAnimation)) {
      return;
    }

    const type = button === 0 ? 'left' : 'right';
    clickAnimationId.current += 1;
    
    setActiveClickAnimations(prev => [...prev, {
      id: clickAnimationId.current,
      x,
      y,
      type,
      timestamp: Date.now()
    }]);

    // Remove animation after 500ms
    setTimeout(() => {
      setActiveClickAnimations(prev => 
        prev.filter(animation => animation.id !== clickAnimationId.current)
      );
    }, 500);
  };

  const playPath = (): void => {
    if (!snapshots.length) return;

    setIsPlaying(true);
    let currentIndex = 0;

    const playNext = (): void => {
      if (currentIndex >= snapshots.length) {
        stopPlayback();
        if (onReplayComplete) onReplayComplete();
        return;
      }

      const snapshot = snapshots[currentIndex];
      setReplayPosition({ x: snapshot.x, y: snapshot.y });

      // Handle scroll events
      if (snapshot.type === 'scroll') {
        window.scrollTo(snapshot.scrollPosition.x, snapshot.scrollPosition.y);
      }

      // Handle click events
      if (snapshot.type === 'down' && snapshot.button !== undefined) {
        addClickAnimation(snapshot.x, snapshot.y, snapshot.button);
      }

      // Determine cursor type based on position and manifest
      const context = mouseContextManifest.find(
        (item) =>
          snapshot.x >= item.boundingBox.left &&
          snapshot.x <= item.boundingBox.right &&
          snapshot.y >= item.boundingBox.top &&
          snapshot.y <= item.boundingBox.bottom
      );

      setCurrentCursor(context?.cursor || "default");

      const nextDelay =
        currentIndex < snapshots.length - 1
          ? Math.max(1, snapshots[currentIndex + 1].timestamp)
          : 0;

      timeoutRef.current = window.setTimeout(() => {
        currentIndex++;
        playNext();
      }, nextDelay);
    };

    playNext();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      playPath();
    } else {
      stopPlayback();
    }
  }, [snapshots]);

  const renderClickAnimation = (animation: {
    id: number;
    x: number;
    y: number;
    type: 'left' | 'right';
  }) => {
    if (animation.type === 'left' && customLeftClickAnimation) {
      return cloneElement(customLeftClickAnimation as ReactElement<any>, {
        style: {
          position: 'absolute',
          left: animation.x,
          top: animation.y,
          transform: 'translate(-50%, -50%)'
        }
      });
    }

    if (animation.type === 'right' && customRightClickAnimation) {
      return cloneElement(customRightClickAnimation as ReactElement<any>, {
        style: {
          position: 'absolute',
          left: animation.x,
          top: animation.y,
          transform: 'translate(-50%, -50%)'
        }
      });
    }

    // Default click animations
    return (
      <div
        key={animation.id}
        style={{
          position: 'absolute',
          left: animation.x,
          top: animation.y,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: `2px solid ${animation.type === 'left' ? '#007AFF' : '#FF3B30'}`,
          transform: 'translate(-50%, -50%)',
          animation: 'clickAnimation 500ms ease-out',
        }}
      />
    );
  };

  const renderCursor = () => {
    const position = replayPosition || currentPosition;
    if (!position) return null;
    const { x, y } = position;

    switch (currentCursor) {
      case "text":
        return <TextSelectCursor x={x} y={y} />;
      case "pointer":
        return <PointerCursor x={x} y={y} />;
      default:
        return <DefaultCursor x={x} y={y} />;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes clickAnimation {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {renderCursor()}
        {activeClickAnimations.map(animation => renderClickAnimation(animation))}
      </div>
    </>
  );
};