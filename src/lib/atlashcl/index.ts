
import * as monaco from 'monaco-editor';
import { defaultConfig, Config } from "./config";


export interface IAtlasHCL {
  getLanguageName(): string
  getLanguageExt(): string[]
  getLanguageConf(): any
  getTokenProvider(): monaco.languages.IMonarchLanguage
  getCompletionProvider(): monaco.languages.CompletionItemProvider
}

export interface ICodeCompletion {
  getProvider() : monaco.languages.CompletionItemProvider
}

class AtlasHCL implements IAtlasHCL {
    private config: Config;
    private codeCompletion: ICodeCompletion;
  
    constructor(
      codeCompletion: ICodeCompletion,
      config : Config = defaultConfig()) {
      this.config = config
      this.codeCompletion = codeCompletion
    }
  
    getLanguageConf(): any {
      return this.config.conf
    }
  
    getLanguageName(): string {
      return this.config.name
    }
  
    getLanguageExt(): string[] {
      return this.config.ext
    }
  
    getTokenProvider(): monaco.languages.IMonarchLanguage {
      return this.config.token
    }
    
    getCompletionProvider(): monaco.languages.CompletionItemProvider {
      return this.codeCompletion.getProvider()
    }
  }

export default AtlasHCL