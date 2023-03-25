import { Dialect } from "./atlashcl/dialect";
import Schema, {schemaConfig} from "./atlashcl/templates/schema";
import Config from "./atlashcl/templates/config";
import AtlasHCL from "./atlashcl";
import CodeCompletion from "./atlashcl/codecompletion";
import * as Monaco from 'monaco-editor';
import { HCLNavigator } from "./atlashcl/hclnavigator";

const langIdConf = {
  prefix: "atlashcl",
  sep: "_",
}

function genSchemaLangId(name : string) {
  return [langIdConf.prefix, "schema", name].join(langIdConf.sep)
}

function genConfigLangId(name : string) {
  return [langIdConf.prefix, "config", name].join(langIdConf.sep)
}

// List of language ids that Atlashcl supports
export const langIds = {
  schema: {
    sqlite: genSchemaLangId(Dialect.sqlite),
    mysql: genSchemaLangId(Dialect.mysql),
    postgresql: genSchemaLangId(Dialect.postgresql),
  },
  config: genConfigLangId("")
}

// Register all languages that atlashcl supports to the monaco instance 
export function AutoRegister(monaco : typeof Monaco) {
  RegisterSchema(monaco, Dialect.mysql, langIds.schema.mysql)
  RegisterSchema(monaco, Dialect.postgresql, langIds.schema.postgresql)
  RegisterSchema(monaco, Dialect.sqlite, langIds.schema.sqlite)
  RegisterConfig(monaco, langIds.config)
}

// Register AtlasHCL Schema to monaco
function RegisterSchema(monaco : typeof Monaco, dialect : Dialect, langId: string) {
  const hclNavigator = new HCLNavigator(Schema[dialect], schemaConfig)
  const codeCompletion = new CodeCompletion(hclNavigator)
  const atlashcl = new AtlasHCL(codeCompletion)

  // Register new language 
  monaco.languages.register({
    id: langId,
    extensions: atlashcl.getLanguageExt()
  })

  // Set Tokenizer vs Language config
  monaco.languages.setLanguageConfiguration(
    langId, 
    atlashcl.getLanguageConf())
  monaco.languages.setMonarchTokensProvider(
    langId, 
    atlashcl.getTokenProvider()
  )

  // Register completion provider
  monaco.languages.registerCompletionItemProvider(
    langId,
    atlashcl.getCompletionProvider()
  )

}

// Register AtlasHCL Config to monaco
export function RegisterConfig(monaco: typeof Monaco, langId: string) {
  const hclNavigator = new HCLNavigator(Config)
  const codeCompletion = new CodeCompletion(hclNavigator)
  const atlashcl = new AtlasHCL(codeCompletion)
  
  RegisterBase(monaco, atlashcl, langId)
}

export function RegisterBase(monaco: typeof Monaco, atlashcl : AtlasHCL, langId : string) {
  // Register new language 
  monaco.languages.register({
    id: langId,
    extensions: atlashcl.getLanguageExt()
  })

  // Set Tokenizer vs Language config
  monaco.languages.setLanguageConfiguration(
    langId, 
    atlashcl.getLanguageConf())
  monaco.languages.setMonarchTokensProvider(
    langId,
    atlashcl.getTokenProvider()
  )

  // Register completion provider
  monaco.languages.registerCompletionItemProvider(
    langId,
    atlashcl.getCompletionProvider()
  )
}

export default AtlasHCL