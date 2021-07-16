import { cellTypes } from "../constants";
import { transformImageDirection } from "../functions";
import Logo from "../media/logo.svg";
import Rocket from "../media/rocket.png";
import Asteroid from "../media/asteroid.svg";
import MemoizedStarBackground from "./StarBackground";

const DisplayBoard = ({ rows, direction, gridLines }) => {
  const grid = gridLines ? { border: "1px solid darkslategrey" } : null;
  return (
    <div className="center" id="board" style={{ display: "relative" }}>
      <MemoizedStarBackground
        fullScreen={false}
        twinkleMin={2}
        twinkleMax={5}
        starNumber={100}
      />
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
                      style={transformImageDirection(direction)}
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
