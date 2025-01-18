import React, { useState } from "react";
import { GeometricShapes } from "./components/GeometricShapes";
import { Mouse } from "@fullstackcraftllc/codevideo-mouse";
import { MouseAction } from "@fullstackcraftllc/codevideo-types";

const MouseTracker: React.FC = () => {
  const [mouseActions, setMouseActions] = useState<Array<MouseAction>>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [replaying, setReplaying] = useState<boolean>(false);
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  const toggleRecording = (): void => {
    if (recording) {
      setRecording(false);
    } else {
      setRecording(true);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const mousePath = [];

  // for each mouseAction, get the mouse-move

  const estSize = formatBytes(mousePath.length * 8 * 2);

  return (
    <>
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={toggleRecording}
            className={`px-4 py-2 rounded ${recording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
              } text-white`}
          >
            {recording ? "Stop Recording Mouse" : "Start Recording Mouse"}
          </button>
        </div>
        <div className="relative flex gap-2">
          {!recording ? (
            <button
              onClick={() => setReplaying(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Playback Mouse Movement
            </button>
          ) : (
            <button
              onClick={() => setReplaying(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop Playback
            </button>
          )}
        </div>

        <div className="mt-4">
          <p>
            Recorded points: {mousePath.length} (Est. size in browser: {estSize}
            )
          </p>
          <p>
            Mouse Position: {mouseX}, {mouseY}
          </p>
          <p>Mouse actions:</p>
          <pre>{JSON.stringify(mouseActions, null, 2)}</pre>
        </div>
      </div>
      <Mouse recording={recording} replaying={replaying} setMouseActions={setMouseActions} setMouseX={setMouseX} setMouseY={setMouseY} />
      <GeometricShapes />
    </>
  );
};

export default MouseTracker;
