import React, { useState, useEffect, useRef } from "react";
import "./SnakeBoard.css";
import Logo from "./logo.svg";
import Rocket from "./rocket.png";

// grid size to be made adjustable
const gridSize = 10;
// names
const BLANK = "blank";
const SNAKE = "snake";
const FOOD = "food";
const LEFT = "left";
const RIGHT = "right";
const UP = "up";
const DOWN = "down";

const randomPosition = () => {
  const position = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
  return position;
};
export const SnakeBoard = () => {
  let initialRows = [];
  for (let i = 0; i < gridSize; i++) {
    initialRows.push([]);
    for (let k = 0; k < gridSize; k++) {
      initialRows[i].push(BLANK);
    }
  }
  const [rows, setRows] = useState(initialRows);
  const [rocket, setRocket] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  const [food, setFood] = useState(randomPosition);
  const [direction, setDirection] = useState(RIGHT);

  const changeDirection = () => {
    const newRocket = [];
    switch (direction) {
      case LEFT:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y - 1 + gridSize) % gridSize,
        });
        break;
      case RIGHT:
        newRocket.push({ x: rocket[0].x, y: (rocket[0].y + 1) % 10 });
        break;
      case UP:
        newRocket.push({
          x: (rocket[0].x - 1 + gridSize) % gridSize,
          y: rocket[0].y,
        });
        break;
      case DOWN:
        newRocket.push({ x: (rocket[0].x + 1) % gridSize, y: rocket[0].y });
        break;
      default:
        return null;
    }
    rocket.forEach((cell) => {
      newRocket.push(cell);
    });
    if (rocket[0].x === food.x && rocket[0].y === food.y) {
      setFood(randomPosition);
    } else {
      newRocket.pop();
    }
    setRocket(newRocket);
    displayRocket();
  };
  const changeDirectionWithKeys = (e) => {
    var { keyCode } = e;
    switch (keyCode) {
      case 37:
        setDirection("left");
        break;
      case 38:
        setDirection("top");
        break;
      case 39:
        setDirection("right");
        break;
      case 40:
        setDirection("bottom");
        break;
      default:
        break;
    }
  };

  document.addEventListener("keydown", changeDirectionWithKeys, false);
  const displayRocket = () => {
    const newRows = initialRows;
    rocket.forEach((cell) => {
      newRows[cell.x][cell.y] = SNAKE;
    });
    newRows[food.x][food.y] = FOOD;
    console.log(newRows);
    setRows(newRows);
  };
  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  useInterval(changeDirection, 300);

  const displayRows = rows.map((row, idx) => (
    <li key={idx} className="row" id="testy">
      {row.map((square) => {
        switch (square) {
          case BLANK:
            return <div className="blank App-logo"></div>;
          case SNAKE:
            return <img className="blank App-logo" alt="rocket" src={Rocket} />;
          case FOOD:
            return (
              <img className="blank App-logo" alt="react logo" src={Logo} />
            );
          default:
            return null;
        }
      })}
    </li>
  ));
  return (
    <div className="center" id="board">
      {displayRows}
    </div>
  );
};
