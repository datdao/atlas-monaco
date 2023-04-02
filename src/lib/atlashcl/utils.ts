import * as monaco from "monaco-editor";

function isOverlap(src: monaco.IRange, dst: monaco.IRange): boolean {
  if (
    src.startLineNumber <= dst.startLineNumber &&
    src.endLineNumber >= dst.endLineNumber &&
    src.startColumn <= dst.startColumn &&
    src.endColumn >= dst.endColumn
  ) {
    return true;
  }

  return false;
}

function isPositionInsideRange(
  position: monaco.IPosition,
  range: monaco.IRange
): boolean {
  if (
    position.lineNumber < range.startLineNumber ||
    position.lineNumber > range.endLineNumber
  ) {
    return false;
  }
  if (
    position.lineNumber === range.startLineNumber &&
    position.column < range.startColumn
  ) {
    return false;
  }
  if (
    position.lineNumber === range.endLineNumber &&
    position.column > range.endColumn
  ) {
    return false;
  }
  return true;
}

export { isOverlap, isPositionInsideRange };
