
import { Dialect } from "./dialect";
import * as monaco from 'monaco-editor';
import { defaultConfig, Config } from "./config";
import CodeCompletion from "./autocompletion";

export interface IAtlasHcl {
  getLanguageName(): string
  getLanguageExt(): string[]
  getLanguageConf(): object
  getTokenProvider(): monaco.languages.IMonarchLanguage
  getCompletionProvider(): monaco.languages.CompletionItemProvider
}

export interface ICodeCompletion {
  items() : monaco.languages.CompletionItemProvider
}

class AtlasHcl implements IAtlasHcl {
    private dialect: Dialect;
    private config: Config;
    private codeCompletion: ICodeCompletion;
  
    constructor(
      dialect : Dialect = Dialect.sql, 
      config : Config = defaultConfig(),
      codeCompletion: ICodeCompletion = null) {
      this.dialect = dialect
      this.config = config
      this.codeCompletion = codeCompletion
      
      if (codeCompletion == null) {
        this.codeCompletion = new CodeCompletion(this.dialect)
      }
    }
  
    getLanguageConf(): object {
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
      return this.codeCompletion.items()
    }
  }

export default AtlasHcl