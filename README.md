# @fullstackcraft/codevideo-mouse

Record your mouse moves to the pixel, capturing movement timing, speed, and even left-clicks, right-clicks, or highlights!

`codevideo-mouse` exports a single React component, `Mouse`, which can be used in a variety of ways to record, replay, and visualize mouse movements.

## Usage - Record Mouse Movements

```tsx
import React, { useState } from 'react';
import { IAction } from '@fullstackcraft/codevideo-types';
import { IMouseAction } from '@fullstackcraft/codevideo-mouse';

export default App = () => {
    const [mouseActions, setMouseActions] = useState<Array<IMouseAction>>([]);
    const [recording, setRecording] = useState(false);
    const [replaying, setReplaying] = useState(false);
    return (
        <Mouse 
            setMouseActions={setMouseActions}
            recording={recording} 
            replaying={replaying}
        />
    )
}

```

All props that can be passed to Mouse are defined in [`IMouseProps`](./src/interfaces/IMouseProps):

```typescript
interface IMouseProps {
    mouseActions?: Array<IMouseAction>; // Optional, an array of mouse actions to replay. Useful for when the mouse is in "driver" mode, and you want to replay the mouse actions
    setMouseActions?: (actions: Array<IMouseAction>) => void; // Optional, but essential if you need to interface with other codevideo components, such as video making and so on. This is the function to set the mouse actions as they are recorded
    setMouseX?: (x: number) => void;
    setMouseY?: (y: number) => void;
    recording?: boolean; // Whether or not to record mouse movements
    replaying?: boolean; // Whether or not to replay mouse movements
    recordWithTrail?: boolean; // Optional, whether or not to record the mouse trail
    replayWithTrail?: boolean; // Optional, whether or not to replay the mouse trail
    leftClickAnimation?: boolean; // Optional, whether or not to animate left clicks
    rightClickAnimation?: boolean; // Optional, whether or not to animate right clicks
    customLeftClickAnimation?: () => JSX.Element; // Optional, a custom animation to show for left clicks
    customRightClickAnimation?: () => JSX.Element; // Optional, a custom animation to show for right clicks
    interactWithElements?: boolean; // Optional, whether or not clicks, drags and more interact with elements on the page
}
```

(Click on the interface for the most up-to-date information - I can't guarantee that this README will always be up-to-date!)

## Run Example App

To run the example app, clone this repository and run the following commands:

```shell
cd examples
```