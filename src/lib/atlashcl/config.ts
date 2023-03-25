import {conf, language} from "monaco-editor/esm/vs/basic-languages/hcl/hcl"
import * as monaco from 'monaco-editor';

export type Config = {
    name: string,
    ext: string[],
    token: monaco.languages.IMonarchLanguage,
    conf: any
}

export function defaultConfig() {
    return {
        name: "atlashcl",
        ext: [".hcl"],
        token: language,
        conf: conf
    }
}