import { Dialect } from "./dialect";
import * as monaco from 'monaco-editor';
import AtlasHcl from "./atlashcl";


export function AutoRegisterToMonaco(dialect: Dialect) {
  const atlashcl = new AtlasHcl(dialect)
  
  // Register new language 
  monaco.languages.register({
    id: atlashcl.getLanguageName(),
    extensions: atlashcl.getLanguageExt()
  })

  // Set Tokenizer vs Language config
  monaco.languages.setLanguageConfiguration(
    atlashcl.getLanguageName(), 
    atlashcl.getLanguageConf())

  monaco.languages.setMonarchTokensProvider(
    atlashcl.getLanguageName(), 
    atlashcl.getTokenProvider()
  )

  // Register completion logic
  let disposeCompletionItemProvider : monaco.IDisposable
  disposeCompletionItemProvider = monaco.languages.registerCompletionItemProvider(
    atlashcl.getLanguageName(),
    atlashcl.getCompletionProvider()
  )

  const registerCompletionItemProvider = (dialect : Dialect) => {
    if (disposeCompletionItemProvider != null) {
      disposeCompletionItemProvider.dispose()
    }

    const atlashcl = new AtlasHcl(dialect)
    disposeCompletionItemProvider = monaco.languages.registerCompletionItemProvider(
      atlashcl.getLanguageName(),
      atlashcl.getCompletionProvider()
    )
  }

  return {
    atlashcl, registerCompletionItemProvider
  }
}

export default AtlasHcl