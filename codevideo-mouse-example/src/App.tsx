import React, { useState } from "react";
import { GeometricShapes } from "./components/GeometricShapes.tsx";
import { Mouse } from "@fullstackcraftllc/codevideo-mouse";
import { MouseAction } from "@fullstackcraftllc/codevideo-types";

function App() {
  const [recordedMouseAction, setRecordedMouseAction] = useState<MouseAction>();
  const [mouseActions, setMouseActions] = useState<Array<MouseAction>>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [clearRecording, setClearRecording] = useState<boolean>(false);
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

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    try {
      // Parse the input text as JSON
      const parsedActions = JSON.parse(e.target.value);

      // Validate that it's an array
      if (!Array.isArray(parsedActions)) {
        console.error('Input must be an array of mouse actions');
        return;
      }

      // Validate each action has required properties
      const validActions = parsedActions.every(action =>
        typeof action === 'object' &&
        typeof action.name === 'string' &&
        typeof action.value === 'string'
      );

      if (!validActions) {
        console.error('Each action must have name and value properties');
        return;
      }

      // Set the validated mouse actions
      setMouseActions(parsedActions);
    } catch (error) {
      console.error('Failed to parse mouse actions:', error);
    }
  };

  const mousePath = [];

  // for each mouseAction, get the mouse-move

  const estSize = formatBytes(mousePath.length * 8 * 2);

  console.log(recordedMouseAction?.value)

  const safeParse = () => {
    if (recordedMouseAction?.value && recordedMouseAction?.value !== "") {
      return JSON.parse(recordedMouseAction.value)
    }
    return {}
  }

  const recordedMouseActionParsed = safeParse()

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
          {!recording && recordedMouseAction && recordedMouseActionParsed.length > 0 && (
            <button
              onClick={() => setReplaying(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Playback Mouse Movement
            </button>
          )}
          {replaying && (
            <button
              onClick={() => setReplaying(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop Playback
            </button>
          )}
          {recordedMouseAction && recordedMouseActionParsed.length > 0 && (
            <button
              onClick={() => setClearRecording(true)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Recording
            </button>
          )}
        </div>

        <div className="mt-4">
          <pre>
            {`Current Mouse Props:
mouseActions: ${JSON.stringify(recordedMouseAction)}
setMouseActions: function(actions)
setMouseX: function(x)
setMouseY: function(y)
recording: ${recording}
clearRecording: ${clearRecording}
replaying: ${replaying}
recordWithTrail: true
recordTrailLength: undefined
replayTrailLength: undefined
replayWithTrail: undefined
onReplayComplete: undefined
leftClickAnimation: undefined
rightClickAnimation: undefined
customLeftClickAnimation: undefined
customRightClickAnimation: undefined
interactWithElements: undefined`}
          </pre>
          <p>
            Recorded points: {mousePath.length} (Est. size in browser: {estSize}
            )
          </p>
          <p>
            Mouse Position: {mouseX}, {mouseY}
          </p>
          <p>Mouse actions to drive mouse:</p>
          <pre>{JSON.stringify(mouseActions, null, 2)}</pre>
          <p>Recorded mouse action (in 'abstracted form'):</p>
          <pre>{JSON.stringify([recordedMouseAction], null, 2)}</pre>
          <p>Now the fun begins: paste in any abstracted mouse action to drive the mouse on this page:</p>
          <textarea onChange={onTextAreaChange} />
        </div>
      </div>
      <Mouse
        mouseActions={mouseActions}
        recording={recording}
        clearRecording={clearRecording}
        replaying={replaying}
        recordWithTrail={true}
        setRecordedMouseAction={setRecordedMouseAction}
        setMouseX={setMouseX}
        setMouseY={setMouseY} />
      <GeometricShapes />
    </>
  );
};

export default App;