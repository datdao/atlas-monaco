import * as monaco from 'monaco-editor';
export type Config = {
    name: string;
    ext: string[];
    token: monaco.languages.IMonarchLanguage;
    conf: object;
};
export declare function defaultConfig(): {
    name: string;
    ext: string[];
    token: any;
    conf: any;
};
