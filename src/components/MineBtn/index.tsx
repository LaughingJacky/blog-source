import React, { FC, MouseEventHandler } from "react";

const numColorMap = new Map([
  [1, 'blue'],
  [2, 'green'],
  [-1, 'red']
]);

enum EmoIco {
  BOMB = '💣',
  FLAG = '🚩'
}

interface IMineBtn {
  cellKey: string;
  cellValue: string | number;
  failedBombKey: string;
  flaggedKeys: Set<unknown>;
  revealedKeys: Set<unknown>;
  onContextMenu: MouseEventHandler<HTMLButtonElement>;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const MineBtn: FC<IMineBtn> = (props) => {
  const { failedBombKey, flaggedKeys, revealedKeys, cellKey, cellValue, onClick, onContextMenu } = props;
  const isBombed = !!failedBombKey && cellValue === 'bomb';
  const isFlagged = flaggedKeys.has(cellKey);
  const isRevealed = revealedKeys.has(cellKey);
  let textContent = '';
  const btnStyle: {
    color?: string;
    backgroundColor?: string;
  } = {};

  // 如果为数目提示，绘制数字
  if (isRevealed && Number(cellValue) >= 1) {
    textContent = String(cellValue);
    btnStyle.color = numColorMap.get(Number(cellValue)) || numColorMap.get(-1);
  }
  // 如果是炸弹，绘制炸弹
  if (isBombed) {
    textContent = EmoIco.BOMB;
    if (cellKey === failedBombKey) btnStyle.backgroundColor = 'red';
  }
  // 如果是标志，绘制标志
  if (isFlagged) textContent = EmoIco.FLAG;

  // 当揭开是0数字或者炸弹时，禁用按钮
  const isDisabled = isRevealed && !(cellValue >= 1) || isBombed;

  return <button
    key={cellKey}
    disabled={isDisabled}
    style={btnStyle}
    className={`cell${!isRevealed ? ' closed' : ''}`}
    onClick={onClick}
    onContextMenu={onContextMenu}
  >{textContent}</button>
}