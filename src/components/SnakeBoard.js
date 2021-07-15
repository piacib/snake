import React, { useState, useEffect, useCallback } from "react";
//css
import "../style/SnakeBoard.css";
//hooks
import { useArrowKeys } from "../hooks/useArrowKeys";
import { useInterval } from "../hooks/useInterval";
import { useInput } from "../hooks/useInput";
//components
import GameOver from "./GameOver";
import DisplayBoard from "./DisplayBoard";
//constants
import { cellTypes, directions, intervals } from "../constants";

//initial values
const initialSnake = (size, position) => {
  const positionObj = {
    topLeft: [
      { y: 0, x: 1 },
      { y: 0, x: 0 },
    ],
    topRight: [
      { y: 0, x: size.width - 2 },
      { y: 0, x: size.width - 1 },
    ],
    bottomLeft: [
      { y: size.height - 1, x: 1 },
      { y: size.height - 1, x: 0 },
    ],
    bottomRight: [
      { y: size.height - 1, x: size.width - 2 },
      { y: size.height - 1, x: size.width - 1 },
    ],
    center: [
      { y: Math.floor(size.height / 2), x: Math.ceil(size.width / 2) },
      { y: Math.floor(size.height / 2), x: Math.ceil(size.width / 2) - 1 },
    ],
  };
  return positionObj[position];
};

const randomPosition = ({ height, width }) => {
  const position = {
    y: Math.floor(Math.random() * height),
    x: Math.floor(Math.random() * width),
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
  duplicates && console.log("dup", arrayOfObjects);
  return duplicates;
}
const gridGenerator = ({ height, width }) => {
  let initialRows = [];
  for (let i = 0; i < height; i++) {
    initialRows.push([]);
    for (let k = 0; k < width; k++) {
      initialRows[i].push(cellTypes.BLANK);
    }
  }
  return initialRows;
};
const SnakeBoard = () => {
  const { value: height, bind: bindHeight } = useInput(10);
  const { value: width, bind: bindWidth } = useInput(10);
  const [gridLines, setGridLines] = useState(false);
  const [rows, setRows] = useState(gridGenerator({ height, width }));
  const [rocket, setRocket] = useState([
    { y: 0, x: 1 },
    { y: 0, x: 0 },
  ]);
  const [food, setFood] = useState(randomPosition({ height, width }));
  const [gameOver, setGameOver] = useState(false);
  const [interval, setInterval] = useState(intervals.normal);
  const [clicked, setClicked] = useState(false);
  const [direction, setDirection, changeDirectionWithKeys] = useArrowKeys(
    directions.RIGHT
  );
  const [savedOptions, setSavedOptions] = useState({
    interval: interval,
    rocket: rocket,
    direction: direction,
  });
  const setRandomFoodPosition = () => {
    setFood(randomPosition({ height, width }));
  };

  const resetGame = () => {
    setGameOver(false);
    setClicked(false);
    setRocket(savedOptions.rocket);
    setDirection(savedOptions.direction);
    setInterval(savedOptions.interval);
    setRows(gridGenerator({ height, width }));
    setRandomFoodPosition();
  };

  // creates new rocket
  const displayRocket = ({ height, width }) => {
    const newRows = gridGenerator({ height, width });
    //set head and body features of snake
    rocket.forEach((cell, idx) => {
      idx === 0
        ? (newRows[cell.y][cell.x] = cellTypes.HEAD)
        : (newRows[cell.y][cell.x] = cellTypes.SNAKE);
    });
    newRows[food.y][food.x] = cellTypes.FOOD;
    setRows(newRows);
  };
  const changeDirection = () => {
    const newRocket = [];
    switch (direction) {
      case directions.LEFT:
        newRocket.push({
          x: (rocket[0].x - 1 + width) % width,
          y: rocket[0].y,
        });
        break;
      case directions.RIGHT:
        newRocket.push({
          x: (rocket[0].x + 1) % width,
          y: rocket[0].y,
        });
        break;
      case directions.UP:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y - 1 + height) % height,
        });
        break;
      case directions.DOWN:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y + 1) % height,
        });
        break;
      default:
        return null;
    }
    rocket.forEach((cell) => {
      newRocket.push(cell);
    });
    if (rocket[0].x === food.x && rocket[0].y === food.y) {
      setRandomFoodPosition();
    } else {
      newRocket.pop();
    }
    newRocket[0].head = true;
    newRocket[1].head = false;

    setRocket(newRocket);
    displayRocket({ height, width });
  };

  useInterval(changeDirection, interval);

  const endGame = useCallback(() => {
    document.removeEventListener("keydown", changeDirectionWithKeys, true);
    setInterval(null);
  }, [changeDirectionWithKeys]);
  // end game if you run into self
  useEffect(() => {
    hasDuplicates(rocket) && setGameOver(true);
  }, [rocket]);
  //ends game and toggles eventlistener when game ends or starts
  useEffect(() => {
    gameOver === true
      ? endGame()
      : document.addEventListener("keydown", changeDirectionWithKeys, false);
  }, [gameOver, changeDirectionWithKeys, endGame]);

  let styles = clicked ? { backgroundColor: "rgb(242, 111, 91)" } : null;
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    console.log(gridLines);
    // setSavedOptions({ ...savedOptions });
    //setSize({ height: height, width: width });
    resetGame();
    setClicked(!clicked);
  };
  const handleClick = (e) => {
    console.log("clicker", clicked);
    setClicked(!clicked);
    !clicked ? setGameOver(true) : resetGame();
    // !clicked ? setInterval(null) : setInterval(initialInterval);
  };
  const displayForm = () => {
    return clicked ? { display: "block" } : { display: "none" };
  };
  return (
    <>
      <>
        <div className="optionHeader" style={styles}>
          <svg
            onClick={handleClick}
            viewBox="0 0 100 80"
            width="40"
            height="40"
          >
            <rect width="100" height="20" rx="8"></rect>
            <rect y="30" width="100" height="20" rx="8"></rect>
            <rect y="60" width="100" height="20" rx="8"></rect>
          </svg>
          <form
            className="game-inputs"
            style={displayForm()}
            onSubmit={(e) => handleSubmit(e)}
          >
            <select
              name="speed"
              id="speed"
              onChange={(event) => {
                let initialInterval = intervals[event.target.value];
                setInterval(initialInterval);
                setSavedOptions({
                  ...savedOptions,
                  interval: initialInterval,
                });
              }}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
              <option value="insane">Insane</option>
            </select>
            <select
              name="startPosition"
              id="startPosition"
              defaultValue="topLeft"
              onChange={(event) => {
                let initialRocket = initialSnake(
                  { height, width },
                  event.target.value
                );
                setRocket(initialRocket);
                setSavedOptions({
                  ...savedOptions,
                  rocket: initialRocket,
                });
              }}
            >
              <option value="topRight">Top Right</option>
              <option value="bottomRight">Bottom Right</option>
              <option value="center">Center</option>
              <option value="topLeft">Top Left</option>
              <option value="bottomLeft">Bottom Left</option>
            </select>
            <select
              name="startDirection"
              id="startDirection"
              defaultValue="right"
              onChange={(event) => {
                let initialDirection = event.target.value;
                setDirection(initialDirection);
                setSavedOptions({
                  ...savedOptions,
                  direction: initialDirection,
                });
              }}
            >
              <option value={directions.RIGHT}>Right</option>
              <option value={directions.LEFT}>Left</option>
              <option value={directions.UP}>Up</option>
              <option value={directions.DOWN}>Down</option>
            </select>
            <label>Grid Lines: </label>
            <label className="switch">
              <input
                type="checkbox"
                onChange={() => {
                  setGridLines(!gridLines);
                  console.log(gridLines);
                }}
                // {...bindGridLines}
              />
              <span className="slider round"></span>
            </label>

            <label>Height: </label>
            <input type="number" id="height" max="20" {...bindHeight} />
            <label>Width: </label>
            <input type="number" id="width" max="20" {...bindWidth} />
            <button type="submit">Submit</button>
          </form>
        </div>
      </>
      {gameOver ? (
        <GameOver score={rocket.length} reset={() => resetGame()} />
      ) : (
        <DisplayBoard rows={rows} direction={direction} gridLines={gridLines} />
      )}
    </>
  );
};
export default SnakeBoard;
