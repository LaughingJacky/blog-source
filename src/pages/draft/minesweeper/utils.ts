import { useState } from "react";
import { COLS, ROWS } from "./const";

export function generateMap(seedBombs) {
  let map = new Map();

  function incrementDanger(neighborKey) {
    if (!map.has(neighborKey)) {
      map.set(neighborKey, 1);
    } else {
      let oldVal = map.get(neighborKey);
      if (oldVal !== 'bomb') {
        map.set(neighborKey, oldVal + 1);
      }
    }
  }

  for (let key of seedBombs) {
    map.set(key, 'bomb');
    for (let neighborKey of getNeighbors(key)) {
      incrementDanger(neighborKey);
    }
  }

  return map;
}


export function getNeighbors(key) {
  let [row, col] = fromKey(key);
  let neighborRowCols: [number, number][] = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1]
  ];

  return neighborRowCols.filter(isInBounds).map(([r, c]) => toKey(r, c));
}

export function fromKey(key) {
  return key.split('-').map(Number);
}

export function toKey(row, col) {
  return `${row}-${col}`;
}


function isInBounds([row, col]) {
  if (row < 0 || col < 0) {
    return false;
  }
  if (row >= ROWS || col >= COLS) {
    return false;
  }
  return true;
}

export function generateBombs(r, c) {
  let count = Math.round(Math.sqrt(r * c));

  let allKeys = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      allKeys.push(toKey(i, j));
    }
  }
  
  allKeys.sort(() => {
    let coinFlip = Math.random() > 0.5;
    return coinFlip ? 1 : -1;
  });

  return allKeys.slice(0, count);
}

//create your forceUpdate hook
export function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}
