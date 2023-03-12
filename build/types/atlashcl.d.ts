import { Dialect } from "./dialect";
import * as monaco from 'monaco-editor';
import { Config } from "./config";
export interface IAtlasHcl {
    getLanguageName(): string;
    getLanguageExt(): string[];
    getLanguageConf(): object;
    getTokenProvider(): monaco.languages.IMonarchLanguage;
    getCompletionProvider(): monaco.languages.CompletionItemProvider;
}
declare class AtlasHcl implements IAtlasHcl {
    private dialect;
    private config;
    private codeCompletion;
    constructor(dialect?: Dialect, config?: Config);
    getLanguageConf(): object;
    getLanguageName(): string;
    getLanguageExt(): string[];
    getTokenProvider(): monaco.languages.IMonarchLanguage;
    getCompletionProvider(): monaco.languages.CompletionItemProvider;
}
export default AtlasHcl;
