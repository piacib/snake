import React, { useState } from "react";
import { SnakeBoard } from "./SnakeBoard";
import { useInput } from "./useInput";
import "./options.css";
export const Options = () => {
  const [clicked, setClicked] = useState(false);
  const [submittedSize, setSubmittedSize] = useState({ height: 10, width: 10 });
  const [initialInterval] = useState(clicked ? null : "200");
  // let initialInterval = clicked ? null : "200";
  let initialSnake = [
    { y: 0, x: 1 },
    { y: 0, x: 0 },
  ];
  let initialDirection = "right";
  const {
    value: height,

    bind: bindHeight,
  } = useInput(10);
  const {
    value: width,

    bind: bindWidth,
  } = useInput(10);
  let styles = clicked ? { backgroundColor: "rgb(242, 111, 91)" } : null;
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedSize({ height: height, width: width });
  };
  return (
    <>
      <div className="optionHeader" style={styles}>
        <svg
          onClick={() => setClicked(!clicked)}
          viewBox="0 0 100 80"
          width="40"
          height="40"
        >
          <rect width="100" height="20" rx="8"></rect>
          <rect y="30" width="100" height="20" rx="8"></rect>
          <rect y="60" width="100" height="20" rx="8"></rect>
        </svg>
        <form onSubmit={(e) => handleSubmit(e)}>
          <select
            name="start-speed"
            id="start-speed"
            defaultValue="normal-speed"
          >
            <option value="slow-speed">Slow</option>
            <option value="normal-speed">Normal</option>
            <option value="fast-speed">Fast</option>
            <option value="insane-speed">Insane</option>
          </select>
          <select
            name="startDirection"
            id="startDirection"
            defaultValue="top-right"
          >
            <option value="top-right">Top Right</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="center">Center</option>
            <option value="top-left">Top Left</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
          <label>Height: </label>
          <input type="number" id="height" max="20" {...bindHeight} />
          <label>Width: </label>
          <input type="number" id="width" max="20" {...bindWidth} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <SnakeBoard
        initialGameOver={clicked}
        initialInterval={initialInterval}
        initialSnake={initialSnake}
        initialDirection={initialDirection}
        gridHeight={submittedSize.height}
        gridWidth={submittedSize.width}
      />
    </>
  );
};
