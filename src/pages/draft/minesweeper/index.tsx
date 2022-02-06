import React, { FC, useEffect, useRef, useState } from 'react';

import { generateMap, generateBombs, toKey, getNeighbors, useForceUpdate } from './utils';
import { SweepState } from './const';
import { MineBtn } from './btn';
import './index.scss';

const SIZE = 48;
const ROWS = 9;
const COLS = 9;

/**
 * @description 简易扫雷
 * @TODO
 * 1. 动态设置难度列
 * 2. 计时逻辑
 */
const MineSweeper: FC = () => {
  const [sqrt, setSqrt] = useState([ROWS, COLS]);
  const [failedBombKey, setFailedBombKey] = useState('');
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [flaggedKeys, setFlaggedKeys] = useState(new Set());
  const [map, setMap] = useState(new Map());
  const [bombNum, setBombNum] = useState(0);
  const [faceEmo, setFaceEmo] = useState(SweepState.HAPPY);

  const totalBomb = useRef(0);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (!!failedBombKey) {
      setFaceEmo(SweepState.LOSE);
    } else if (bombNum === 0 && revealedKeys.size + flaggedKeys.size === ROWS * COLS) {
      setFaceEmo(SweepState.WIN);
    } else if (totalBomb.current === bombNum) {
      setFaceEmo(SweepState.HAPPY);
    }
  }, [failedBombKey, bombNum]);

  const initGame = () => {
    const [rows, cols] = sqrt;
    setFailedBombKey('');
    setRevealedKeys(new Set());
    setFlaggedKeys(new Set());
    const bombs = generateBombs(rows, cols);
    totalBomb.current = bombs.length;
    setBombNum(bombs.length);
    setMap(generateMap(bombs));
  }

  const toggleFlag = key => {
    flaggedKeys.has(key) ? flaggedKeys.delete(key) : flaggedKeys.add(key);
    setBombNum(totalBomb.current - flaggedKeys.size);
  }

  const onCellClick = (key) => () => {
    if (flaggedKeys.has(key) || !!failedBombKey) return;
    revealCell(key);
    forceUpdate();
    // 点击最后一块砖时，不会触发是否获胜的校验，这里手动判断一下
    if (bombNum === 0 && revealedKeys.size + flaggedKeys.size === ROWS * COLS) {
      setFaceEmo(SweepState.WIN);
    }
  }

  const onCellContextMenu = (e, key) => {
    e.persist();
    const isRevealedNum = map.get(key) >= 1 && revealedKeys.has(key);
    if (!!failedBombKey || isRevealedNum) return;
    e.preventDefault();
    toggleFlag(key);
    forceUpdate();
  }

  const revealCell = (key) => {
    if (map.get(key) === 'bomb') {
      setFailedBombKey(key);
    } else {
      // propagateReveal
      propagateReveal(key, new Set());
    }
  }

  const propagateReveal = (key, visited) => {
    // 如果已打标，不记为揭开
    if (!flaggedKeys.has(key)) revealedKeys.add(key);
    visited.add(key);

    const neighborKeys = getNeighbors(key);
    if (!map.has(key)) {
      for (let neighborKey of neighborKeys) {
        if (!visited.has(neighborKey)) {
          propagateReveal(neighborKey, visited);
        }
      }
    } else {
      // 比较标记位是否匹配雷区
      const neighborFlaggedKeys = neighborKeys.filter(k => flaggedKeys.has(k));
      const neighborBombKeys = getNeighbors(key).filter(k => map.get(k) === 'bomb');
      if (neighborFlaggedKeys.length !== neighborBombKeys.length) return;
      const wrongBombs = neighborBombKeys.filter(bombKeys => !neighborFlaggedKeys.includes(bombKeys))
      if (wrongBombs.length > 0) {
        setFailedBombKey(wrongBombs[0])
        return;
      }

      // infer flag judge
      for (let neighborKey of neighborKeys) {
        if (!visited.has(neighborKey)) {
          propagateReveal(neighborKey, visited);
        }
      }
    }
  }

  return <>
    <div className="minesweeper-game" style={{width: sqrt[0] * SIZE}}>
      <div className="top-bar">
        <div className="left">剩余炸弹：{bombNum}</div>
        <div className={`ico-face ${faceEmo}`} onClick={initGame}></div>
        <div></div>
      </div>
      <div className="canvas" style={{
        width: sqrt[0] * SIZE,
        height: sqrt[1] * SIZE,
        pointerEvents: faceEmo === SweepState.HAPPY ? undefined : 'none'
      }}>
      {
        Array.from(Array(sqrt[0]), (_, row) => Array.from(Array(sqrt[1]), (_, col) => {
          const cellKey = toKey(row, col);
          return <MineBtn
            key={cellKey}
            cellKey={cellKey}
            cellValue={map.get(cellKey)}
            failedBombKey={failedBombKey}
            flaggedKeys={flaggedKeys}
            revealedKeys={revealedKeys}
            onContextMenu={e => {
              onCellContextMenu(e, cellKey);
            }}
            onClick={onCellClick(cellKey)}
          />
        }))
      }
      </div>
    </div>
  </>
}

export default MineSweeper;
