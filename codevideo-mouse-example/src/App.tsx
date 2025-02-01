import React, { useState } from "react";
import { Mouse } from "@fullstackcraftllc/codevideo-mouse";
import { GeometricShapes } from "./components/GeometricShapes.tsx";
import { IAction, IMouseSnapshot } from "@fullstackcraftllc/codevideo-types";

const App = () => {
  const [recordedMouseAction, setRecordedMouseAction] = useState<IAction>();
  const [recordedSnapshots, setRecordedSnapshots] = useState<Array<IMouseSnapshot>>();
  const [mouseActions, setMouseActions] = useState<Array<IAction>>([]);
  const [recording, setRecording] = useState(false);
  const [clearRecording, setClearRecording] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [interactWithElements, setInteractWithElements] = useState(true);
  const [recordWithTrail, setRecordWithTrail] = useState(true);
  const [replayWithTrail, setReplayWithTrail] = useState(false);
  const [recordTrailLength, setRecordTrailLength] = useState(500);
  const [replayTrailLength, setReplayTrailLength] = useState(500);

  const toggleRecording = () => {
    setRecording(!recording);
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const onTextAreaChange = (e) => {
    try {
      const parsedActions = JSON.parse(e.target.value) as IAction[];
      if (!Array.isArray(parsedActions)) {
        console.error('Input must be an array of mouse actions');
        return;
      }

      const validActions = parsedActions.every(action =>
        typeof action === 'object' &&
        typeof action.name === 'string' &&
        typeof action.value === 'string'
      );

      if (!validActions) {
        console.error('Each action must have name and value properties');
        return;
      }

      setMouseActions(parsedActions);
      setRecording(false);
      setReplaying(true);
    } catch (error) {
      console.error('Failed to parse mouse actions:', error);
    }
  };

  const mousePath = recordedMouseAction?.value ? JSON.parse(recordedMouseAction.value) : [];
  const estSize = formatBytes(mousePath.length * 8 * 2);

  const safeParse = () => {
    if (recordedMouseAction?.value && recordedMouseAction?.value !== "") {
      return JSON.parse(recordedMouseAction.value);
    }
    return [];
  };

  const recordedMouseActionParsed = safeParse();

  const mode = recording ? 'record' : replaying ? 'replay' : undefined;

  const code = `<Mouse
  mode="${mode || 'undefined'}"
  interactWithElements={${interactWithElements}}
  mouseActions={${JSON.stringify(mouseActions)}}
  clearRecording={${clearRecording}}
  onReplayComplete={() => setReplaying(false)}
  recordWithTrail={${recordWithTrail}}
  replayWithTrail={${replayWithTrail}}
  recordTrailLength={${recordTrailLength}}
  replayTrailLength={${replayTrailLength}}
/>`;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mouse Component Demo</h1>
        <p className="mb-4">An interactive demo showcasing all Mouse component options.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded ${recording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                >
                  {recording ? "Stop Recording" : "Start Recording"}
                </button>

                {!recording && recordedMouseActionParsed.length > 0 && (
                  <button
                    onClick={() => setReplaying(true)}
                    disabled={replaying}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    Playback
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Interact with Elements</label>
                  <div
                    onClick={() => setInteractWithElements(!interactWithElements)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${interactWithElements ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${interactWithElements ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Record with Trail</label>
                  <div
                    onClick={() => setRecordWithTrail(!recordWithTrail)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${recordWithTrail ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${recordWithTrail ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Replay with Trail</label>
                  <div
                    onClick={() => setReplayWithTrail(!replayWithTrail)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${replayWithTrail ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${recordWithTrail ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Record Trail Length: {recordTrailLength}</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={recordTrailLength}
                    onChange={(e) => setRecordTrailLength(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Replay Trail Length: {replayTrailLength}</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={replayTrailLength}
                    onChange={(e) => setReplayTrailLength(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-4">Current Mouse State</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{recordedSnapshots && JSON.stringify(recordedSnapshots[recordedSnapshots.length - 1], null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recording Details</h2>
            <div className="space-y-4">
              <p>Recorded points: {mousePath.length} (Est. size: {estSize})</p>
              <div className="space-y-2">
                <label className="block font-medium">Paste mouse actions to replay:</label>
                <textarea
                  className="w-full h-32 p-2 border rounded resize-none"
                  onChange={onTextAreaChange}
                  placeholder="Paste JSON mouse actions here..."
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium">Component Code:</label>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{code}</code>
                </pre>
              </div>
              <div className="space-y-2">
                <label className="block font-medium">Recorded action:</label>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{JSON.stringify([recordedMouseAction], null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border rounded-lg p-4">
          <GeometricShapes />
        </div>
      </div>
      <Mouse
        mode={mode}
        interactWithElements={interactWithElements}
        actions={mouseActions}
        clearRecording={clearRecording}
        onReplayComplete={() => setReplaying(false)}
        recordWithTrail={recordWithTrail}
        replayWithTrail={replayWithTrail}
        recordTrailLength={recordTrailLength}
        replayTrailLength={replayTrailLength}
        setRecordedMouseAction={setRecordedMouseAction}
        setRecordedSnapshots={setRecordedSnapshots}
      />
    </>
  );
};

export default App;