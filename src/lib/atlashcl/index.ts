import * as monaco from 'monaco-editor';
import { defaultConfig, Config } from "./config";

interface IAtlasHCL {
  getLanguageName(): string
  getLanguageExt(): string[]
  getLanguageConf(): any
  getTokenProvider(): monaco.languages.IMonarchLanguage
  getCodeCompletionProvider(): monaco.languages.CompletionItemProvider
}

interface ICodeCompletion {
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
    
    getCodeCompletionProvider(): monaco.languages.CompletionItemProvider {
      return this.codeCompletion.getProvider()
    }
  }

export default AtlasHCL

export {
  IAtlasHCL,
  ICodeCompletion
}