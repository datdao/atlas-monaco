import * as monaco from 'monaco-editor';
type Resource = {
    resource: string;
    values: string[];
    lineNumber: number;
};
declare const enum Direction {
    up = "up",
    down = "down"
}
type Bracket = {
    open: string;
    close: string;
};
declare class HclParser {
    private textModel;
    private position;
    constructor(textModel: monaco.editor.ITextModel, position: monaco.Position);
    wordRange(): monaco.IRange;
    parentResource(position?: monaco.Position): Resource;
    parentResources(roots?: string[]): Resource[];
    findParentBracket(pairBracket: Bracket, position: monaco.Position, level?: number, direction?: Direction): number;
    listBlockScope(): string[];
    findResourceAtLineNumber(lineNumber: number): Resource;
    parseCurrentLineContentToPath(): string[];
    fillMissingPath(path: string[]): string[];
    compareRange(src: monaco.IRange, dst: monaco.IRange): number;
    findReferencedResourceValues(path: string[]): string[];
}
export default HclParser;
