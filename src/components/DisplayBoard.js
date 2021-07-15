import { cellTypes } from "../constants";
import Logo from "../media/logo.svg";
import Rocket from "../media/rocket.png";
import Asteroid from "../media/asteroid.svg";

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

const DisplayBoard = ({ rows, direction, gridLines }) => {
  const grid = gridLines ? { border: "1px solid black" } : null;
  return (
    <div className="center" id="board">
      {rows.map((row, rowNumber) => (
        <li key={rowNumber} className="row" id="testy">
          {row.map((square, squareNumber) => {
            switch (square) {
              case cellTypes.BLANK:
                return <div className="box" style={grid}></div>;
              case cellTypes.SNAKE:
                return (
                  <div className="box" style={grid}>
                    <img className="tail" src={Asteroid} alt="snake tail" />
                  </div>
                );
              case cellTypes.HEAD:
                return (
                  <div className="box" style={grid}>
                    <img
                      style={transform(direction)}
                      className="head"
                      alt="react logo"
                      src={Rocket}
                    />
                  </div>
                );
              case cellTypes.FOOD:
                return (
                  <div className="box" style={grid}>
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
export default DisplayBoard;
