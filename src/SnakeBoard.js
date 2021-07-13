import React, { useState, useEffect, useCallback } from "react";
import "./SnakeBoard.css";
import Logo from "./logo.svg";
import Rocket from "./rocket.png";
import { useArrowKeys } from "./useArrowKeys";
import { useInterval } from "./useInterval";
// grid size to be made adjustable
const gridSize = 10;
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
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
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
  initialInterval = 300,
  initialSnake = [
    { x: 0, y: 1 },
    { x: 0, y: 0 },
  ],
  initialDirection = RIGHT,
}) => {
  let initialRows = [];
  for (let i = 0; i < gridSize; i++) {
    initialRows.push([]);
    for (let k = 0; k < gridSize; k++) {
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
  const memoizedChangeDirectionWithKeys = useCallback(
    () => changeDirectionWithKeys,
    [gameOver]
  );
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
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y + 1) % 10,
        });
        break;
      case UP:
        newRocket.push({
          x: (rocket[0].x - 1 + gridSize) % gridSize,
          y: rocket[0].y,
        });
        break;
      case DOWN:
        newRocket.push({
          x: (rocket[0].x + 1) % gridSize,
          y: rocket[0].y,
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
      document.removeEventListener(
        "keydown",
        memoizedChangeDirectionWithKeys,
        true
      );
      setInterval(null);
    };
    console.log("render");
    gameOver === true
      ? endGame()
      : document.addEventListener(
          "keydown",
          memoizedChangeDirectionWithKeys,
          false
        );
  }, [gameOver, memoizedChangeDirectionWithKeys]);
  const displayRocket = () => {
    const newRows = initialRows;
    rocket.forEach((cell, idx) => {
      idx === 0
        ? (newRows[cell.x][cell.y] = HEAD)
        : (newRows[cell.x][cell.y] = SNAKE);
    });
    newRows[food.x][food.y] = FOOD;
    setRows(newRows);
  };

  useInterval(changeDirection, interval);
  const resetGame = () => {
    setGameOver(false);
    setRocket(initialSnake);
    setDirection(initialDirection);
    setInterval(initialInterval);
  };

  const displayBoard = rows.map((row, rowNumber) => (
    <li key={rowNumber} className="row" id="testy">
      {row.map((square, squareNumber) => {
        switch (square) {
          case BLANK:
            return <div className="blank App-logo"></div>;
          case SNAKE:
            return (
              <img
                className="blank App-logo body"
                alt="snake body"
                src={Logo}
              />
            );
          case HEAD:
            return (
              <img
                className="blank App-logo head"
                alt="react logo"
                src={Rocket}
              />
            );

          case FOOD:
            return (
              <img
                className="blank App-logo food"
                alt="react logo"
                src={Logo}
              />
            );
          default:
            return null;
        }
      })}
    </li>
  ));
  // return (
  //   <div className="center" id="board">
  //     {displayRows}
  //   </div>
  // );
  return gameOver ? (
    <GameOver score={rocket.length} reset={() => resetGame()} />
  ) : (
    <div className="center" id="board">
      {displayBoard}
    </div>
  );
};
