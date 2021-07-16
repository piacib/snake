import React from "react";
import "../style/StarBackground.css";
const randomObj = (min, max, objLength) => {
  let obj = {};
  for (let i = 1; i <= objLength / 2; i++) {
    obj[2 * i] = [
      Math.random() * (max - 1) + min,
      Math.random() * (max - 1) + min,
    ];
  }
  return obj;
};
const StarBackground = ({
  twinkleMin,
  twinkleMax,
  starNumber,
  fullScreen = true,
}) => {
  if (starNumber % 2 !== 0 && process.env.NODE_ENV !== "production") {
    console.error("Starbackground can only create an even number of stars");
  }
  const starBackgroundStyle = fullScreen
    ? { display: "absolute", starHeightUnit: "vh", starWidthUnit: "vw" }
    : { display: "relative", starHeightUnit: "%", starWidthUnit: "%" };
  const starObj = randomObj(twinkleMin, twinkleMax, starNumber);
  return (
    <div className="star-background" style={starBackgroundStyle}>
      {Object.keys(starObj).map((x) => (
        <>
          <div
            className="star"
            style={{
              top: `${Math.ceil(99 * Math.random())}${
                starBackgroundStyle.starHeightUnit
              }`,
              left: `${Math.ceil(99 * Math.random())}${
                starBackgroundStyle.starWidthUnit
              }`,
              animation: `flickerAnimation ${starObj[x][0]}s infinite`,
            }}
          ></div>
          <div
            className="star"
            style={{
              bottom: `${Math.ceil(99 * Math.random())}${
                starBackgroundStyle.starHeightUnit
              }`,
              right: `${Math.ceil(99 * Math.random())}${
                starBackgroundStyle.starWidthUnit
              }`,
              animation: `flickerAnimation ${starObj[x][1]}s infinite`,
            }}
          ></div>
        </>
      ))}
    </div>
  );
};
// memoizing prevents rerenders on every render which will change the stars positions
const MemoizedStarBackground = React.memo(StarBackground);
export default MemoizedStarBackground;
