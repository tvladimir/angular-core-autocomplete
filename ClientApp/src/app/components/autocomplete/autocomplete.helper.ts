/**
 * Keyboard events
 */
const isArrowUp = (keyCode: number): boolean => keyCode === 38;
const isArrowDown = (keyCode: number): boolean => keyCode === 40;
const isArrowUpDown = (keyCode: number): boolean => isArrowUp(keyCode) || isArrowDown(keyCode);
const isEnter = (keyCode: number): boolean => keyCode === 13;
const isESC = (keyCode: number): boolean => keyCode === 27;
const isTab = (keyCode: number): boolean => keyCode === 9;

export default {
  isArrowUp,
  isArrowDown,
  isArrowUpDown,
  isEnter,
  isESC,
  isTab,
 }
