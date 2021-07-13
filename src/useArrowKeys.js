import { useState } from "react";
const LEFT = "left";
const RIGHT = "right";
const UP = "up";
const DOWN = "down";

export const useArrowKeys = (
  initialState,
  keyCodeActionObj = {
    37: LEFT,
    38: UP,
    39: RIGHT,
    40: DOWN,
  }
) => {
  const [state, setState] = useState(initialState);
  const keysSwitch = (e) => {
    let { keyCode } = e;
    switch (keyCode) {
      case 37:
        setState(keyCodeActionObj[37]);
        break;
      case 38:
        setState(keyCodeActionObj[38]);
        break;
      case 39:
        setState(keyCodeActionObj[39]);
        break;
      case 40:
        setState(keyCodeActionObj[40]);
        break;
      default:
        break;
    }
  };
  return [state, setState, keysSwitch];
};

// export default useArrowKeys;
