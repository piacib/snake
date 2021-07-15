import { cellTypes } from "./constants";
export const initialSnake = (size, position) => {
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

export const randomPosition = ({ height, width }) => {
  const position = {
    y: Math.floor(Math.random() * height),
    x: Math.floor(Math.random() * width),
  };
  return position;
};
export function shallowEqual(object1, object2) {
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
export function hasDuplicates(arrayOfObjects) {
  let duplicates = false;
  arrayOfObjects.map((x, idx) =>
    arrayOfObjects
      .slice(idx + 1)
      .map((items) => (shallowEqual(x, items) ? (duplicates = true) : null))
  );
  duplicates && console.log("dup", arrayOfObjects);
  return duplicates;
}
export const gridGenerator = ({ height, width }) => {
  let initialRows = [];
  for (let i = 0; i < height; i++) {
    initialRows.push([]);
    for (let k = 0; k < width; k++) {
      initialRows[i].push(cellTypes.BLANK);
    }
  }
  return initialRows;
};
//rotate rocket to point in direction of movement
export const transformImageDirection = (direction) => {
  let directionObj = {
    left: "rotate(225deg)",
    right: "rotate(45deg)",
    up: "rotate(-45deg)",
    down: "rotate(135deg)",
  };
  return { transform: directionObj[direction] };
};
