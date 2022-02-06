export const ROWS = 9;
export const COLS = 9;

export const numColorMap = new Map([
  [1, 'blue'],
  [2, 'green'],
  [-1, 'red']
]);

export enum SweepState {
  HAPPY = 'happy',
  WIN = 'win',
  LOSE = 'lose'
}

export enum EmoIco {
  BOMB = '💣',
  FLAG = '🚩'
}
