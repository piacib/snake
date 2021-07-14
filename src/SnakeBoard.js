import React, { useState, useEffect, useCallback } from "react";
import "./SnakeBoard.css";
import Logo from "./media/logo.svg";
import Rocket from "./media/rocket.png";
import Asteroid from "./media/asteroid.svg";
import { useArrowKeys } from "./hooks/useArrowKeys";
import { useInterval } from "./hooks/useInterval";
import { useInput } from "./hooks/useInput";

// names
const BLANK = "blank";
const SNAKE = "snake";
const FOOD = "food";
const HEAD = "head";

const LEFT = "left";
const RIGHT = "right";
const UP = "up";
const DOWN = "down";

//initial values
const initialInterval = { normal: 250, fast: 150, insane: 50, slow: 650 };
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
const gridHeight = 10;
const gridWidth = 10;

const randomPosition = (gridHeight, gridWidth) => {
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
const gridGenerator = ({ height, width }) => {
  let initialRows = [];
  for (let i = 0; i < height; i++) {
    initialRows.push([]);
    for (let k = 0; k < width; k++) {
      initialRows[i].push(BLANK);
    }
  }
  return initialRows;
};
//rotate rocket to point in direction of movement
const transform = (direction) => {
  let directionObj = {
    left: "rotate(225deg)",
    right: "rotate(45deg)",
    up: "rotate(-45deg)",
    down: "rotate(135deg)",
  };
  return { transform: directionObj[direction] };
};
const GameOver = ({ score, reset }) => {
  return (
    <>
      <div>Game over</div>
      <div>Score: {score}</div>
      <button onClick={reset}>Restart</button>
    </>
  );
};
const DisplayBoard = ({ rows, direction }) => {
  return (
    <div className="center" id="board">
      {rows.map((row, rowNumber) => (
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
      ))}
    </div>
  );
};

export const SnakeBoard = () => {
  const [size, setSize] = useState({ height: gridHeight, width: gridWidth });
  const [rows, setRows] = useState(gridGenerator(size));
  const [rocket, setRocket] = useState([
    { y: 0, x: 1 },
    { y: 0, x: 0 },
  ]);
  const [food, setFood] = useState(randomPosition(size.height, size.width));
  const [gameOver, setGameOver] = useState(false);
  const [interval, setInterval] = useState(initialInterval.normal);
  const [clicked, setClicked] = useState(false);

  const { value: height, bind: bindHeight } = useInput(10);
  const { value: width, bind: bindWidth } = useInput(10);
  // const { value: startPosition, bind: bindStartPosition } =
  //   useInput("top-left");
  // const { value: startDirection, bind: bindStartDirection } = useInput(RIGHT);
  const [direction, setDirection, changeDirectionWithKeys] =
    useArrowKeys(RIGHT);
  const [savedOptions, setSavedOptions] = useState({
    interval: interval,
    height: height,
    width: width,
    rocket: rocket,
    direction: direction,
  });
  const setRandomFoodPosition = () => {
    setFood(randomPosition(size.height, size.width));
  };

  const resetGame = () => {
    setGameOver(false);
    // setRocket(initialSnake);
    setClicked(false);
    // setDirection(initialDirection);
    // setInterval(initialInterval);
    setRows(gridGenerator(size));
    setRandomFoodPosition();
  };
  // creates new rocket
  const displayRocket = () => {
    const newRows = gridGenerator(size);
    rocket.forEach((cell, idx) => {
      idx === 0
        ? (newRows[cell.y][cell.x] = HEAD)
        : (newRows[cell.y][cell.x] = SNAKE);
    });
    newRows[food.y][food.x] = FOOD;
    setRows(newRows);
  };
  const changeDirection = () => {
    const newRocket = [];
    switch (direction) {
      case LEFT:
        newRocket.push({
          x: (rocket[0].x - 1 + size.width) % size.width,
          y: rocket[0].y,
        });
        break;
      case RIGHT:
        newRocket.push({
          x: (rocket[0].x + 1) % size.width,
          y: rocket[0].y,
        });
        break;
      case UP:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y - 1 + size.height) % size.height,
        });
        break;
      case DOWN:
        newRocket.push({
          x: rocket[0].x,
          y: (rocket[0].y + 1) % size.height,
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
    setRocket(newRocket);
    displayRocket();
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
    // setSavedOptions({ ...savedOptions });
    setSize({ height: height, width: width });
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
          <form style={displayForm()} onSubmit={(e) => handleSubmit(e)}>
            <select
              name="speed"
              id="speed"
              onChange={(event) => {
                setInterval(initialInterval[event.target.value]);
                setSavedOptions({ ...savedOptions, interval: interval });
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
              // value={""}
              onChange={(event) => {
                setRocket(initialSnake(size, event.target.value));
                setSavedOptions({ ...savedOptions, rocket: rocket });
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
              defaultValue="top-right"
              value={direction}
              onChange={(event) => {
                setDirection(event.target.value);
                setSavedOptions({ ...savedOptions, direction: direction });
              }}
            >
              <option value={RIGHT}>Right</option>
              <option value={LEFT}>Left</option>
              <option value={UP}>Up</option>
              <option value={DOWN}>Down</option>
            </select>
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
        <DisplayBoard rows={rows} direction={direction} />
      )}
    </>
  );
};
