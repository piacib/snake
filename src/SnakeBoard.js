import React, { useState, useEffect } from "react";
import "./SnakeBoard.css";
import Logo from "./media/logo.svg";
import Rocket from "./media/rocket.png";
import Asteroid from "./media/asteroid.svg";
import { useArrowKeys } from "./useArrowKeys";
import { useInterval } from "./useInterval";
// grid size to be made adjustable
const gridSize = 20;
const gridHeight = 10;
const gridWidth = 20;
// names
const BLANK = "blank";
const SNAKE = "snake";
const FOOD = "food";
const HEAD = "head";

const LEFT = "left";
const RIGHT = "right";
const UP = "up";
const DOWN = "down";

const randomPosition = () => {
  const position = {
    y: Math.floor(Math.random() * gridHeight),
    x: Math.floor(Math.random() * gridWidth),
  };
  return position;
};
function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
function hasDuplicates(arrayOfObjects) {
  let duplicates = false;
  arrayOfObjects.map((x, idx) =>
    arrayOfObjects
      .slice(idx + 1)
      .map((items) => (shallowEqual(x, items) ? (duplicates = true) : null))
  );
  return duplicates;
}
const GameOver = ({ score, reset }) => {
  return (
    <>
      <div>Game over</div>
      <div>Score: {score}</div>
      <button onClick={reset}>Restart</button>
    </>
  );
};
export const SnakeBoard = ({
  initialInterval = 250,
  initialSnake = [
    { y: 0, x: 1 },
    { y: 0, x: 0 },
  ],
  initialDirection = RIGHT,
}) => {
  let initialRows = [];
  for (let i = 0; i < gridHeight; i++) {
    initialRows.push([]);
    for (let k = 0; k < gridWidth; k++) {
      initialRows[i].push(BLANK);
    }
  }
  const [rows, setRows] = useState(initialRows);
  const [rocket, setRocket] = useState(initialSnake);
  const [food, setFood] = useState(randomPosition);
  const [direction, setDirection, changeDirectionWithKeys] =
    useArrowKeys(initialDirection);
  const [gameOver, setGameOver] = useState(false);
  const [interval, setInterval] = useState(initialInterval);
  //fix eslint warning
  // const memoizedChangeDirectionWithKeys = useCallback(
  //   () => changeDirectionWithKeys,
  //   [gameOver]
  // );
  const changeDirection = () => {
    const newRocket = [];
    switch (direction) {
      case LEFT:
        newRocket.push({
          x: (rocket[0].x - 1 + gridWidth) % gridWidth,
          y: rocket[0].y,
        });
        break;
      case RIGHT:
        newRocket.push({
          x: (rocket[0].x + 1) % gridWidth,
          y: rocket[0].y,
        });
        break;
      case UP:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y - 1 + gridHeight) % gridHeight,
        });
        break;
      case DOWN:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y + 1) % gridHeight,
        });
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
    newRocket[0].head = true;
    setRocket(newRocket);
    displayRocket();
  };
  useEffect(() => {
    hasDuplicates(rocket) && setGameOver(true);
  }, [rocket]);
  useEffect(() => {
    const endGame = () => {
      document.removeEventListener("keydown", changeDirectionWithKeys, true);
      setInterval(null);
    };
    gameOver === true
      ? endGame()
      : document.addEventListener("keydown", changeDirectionWithKeys, false);
  }, [gameOver, changeDirectionWithKeys]);
  const displayRocket = () => {
    const newRows = initialRows;
    rocket.forEach((cell, idx) => {
      idx === 0
        ? (newRows[cell.y][cell.x] = HEAD)
        : (newRows[cell.y][cell.x] = SNAKE);
    });
    newRows[food.y][food.x] = FOOD;
    setRows(newRows);
  };
  useInterval(changeDirection, interval);
  const resetGame = () => {
    setGameOver(false);
    setRocket(initialSnake);
    setDirection(initialDirection);
    setInterval(initialInterval);
  };
  const transform = (direction) => {
    let directionObj = {
      left: "rotate(225deg)",
      right: "rotate(45deg)",
      up: "rotate(-45deg)",
      down: "rotate(135deg)",
    };
    return { transform: directionObj[direction] };
  };
  const displayBoard = rows.map((row, rowNumber) => (
    <li key={rowNumber} className="row" id="testy">
      {row.map((square, squareNumber) => {
        switch (square) {
          case BLANK:
            return <div className="box"></div>;
          case SNAKE:
            return (
              <div className="box">
                <img className="tail" src={Asteroid} alt="snake tail" />
              </div>
            );
          case HEAD:
            return (
              <div className="box">
                <img
                  style={transform(direction)}
                  className="head"
                  alt="react logo"
                  src={Rocket}
                />
              </div>
            );
          case FOOD:
            return (
              <div className="box">
                <img className="food" alt="react logo" src={Logo} />
              </div>
            );
          default:
            return null;
        }
      })}
    </li>
  ));
  return gameOver ? (
    <GameOver score={rocket.length} reset={() => resetGame()} />
  ) : (
    <>
      <div className="center" id="board">
        {displayBoard}
      </div>
    </>
  );
};
