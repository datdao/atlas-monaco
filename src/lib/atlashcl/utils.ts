import * as monaco from 'monaco-editor';

function isOverlap(src : monaco.IRange, dst : monaco.IRange) : boolean {
    if (src.startLineNumber <= dst.startLineNumber && 
        src.endLineNumber >= dst.endLineNumber &&
        src.startColumn <= dst.startColumn &&
        src.endColumn >= dst.endColumn) {
            return true
    }
    
    return false
}

function isPositionInsideRange(position : monaco.IPosition, range: monaco.IRange) : boolean {
    if (position.lineNumber >=  range.startLineNumber && 
        position.lineNumber <= range.endLineNumber &&
        position.column >= range.startColumn &&
        position.column <= range.endColumn ) {
             return true
        }
    return false
}

export {
    isOverlap,
    isPositionInsideRange
}