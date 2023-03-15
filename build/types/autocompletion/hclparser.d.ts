import * as monaco from 'monaco-editor';
export declare const HCL_REGEX: {
    resourceType: RegExp;
    resourceValue: RegExp;
    attributeType: RegExp;
    path: RegExp;
};
export declare const HCL_REGEX_FUNC: {
    bracket: (bracket: Bracket) => RegExp;
    resourceValuebyType: (type: string) => string;
};
type Resource = {
    resource: string;
    values: string[];
    lineNumber: number;
};
export declare const enum Direction {
    up = "up",
    down = "down"
}
export type Bracket = {
    open: string;
    close: string;
};
export declare const PairCurlyBracket: Bracket;
declare class HclParser {
    private textModel;
    private position;
    constructor(textModel: monaco.editor.ITextModel, position: monaco.Position);
    getWordRange(): monaco.IRange;
    parentResource(position: monaco.Position): Resource;
    parentResources(): Resource[];
    findParentBracket(pairBracket?: Bracket, position?: monaco.Position, level?: number, direction?: Direction): number;
    listBlockScope(): string[];
    findResourceAtLineNumber(lineNumber: number): Resource;
    parseCurrentWordToPath(): string[];
    fillMissingPath(path: string[]): string[];
    compareRange(src: monaco.IRange, dst: monaco.IRange): number;
    findReferencedResourceValues(path: string[]): string[];
}
export default HclParser;
