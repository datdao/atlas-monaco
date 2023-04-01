import { Dialect } from "./atlashcl/dialect";
import Schema, {schemaConfig} from "./atlashcl/templates/schema";
import Config from "./atlashcl/templates/config";
import AtlasHCL from "./atlashcl";
import CodeCompletion from "./atlashcl/codecompletion";
import * as Monaco from 'monaco-editor';
import { HCLNavigator } from "./atlashcl/hcl/navigator";
import { HCLTokenizer } from "./atlashcl/hcl/tokenizer";
import Linter from "./atlashcl/linter";
import Editor from "./atlashcl/editor";

const langIdConf = {
  prefix: "atlashcl",
  sep: "_",
}

function genSchemaLangId(name : string) {
  return [langIdConf.prefix, "schema", name].join(langIdConf.sep)
}

function genConfigLangId() {
  return [langIdConf.prefix, "config"].join(langIdConf.sep)
}

// List of language ids that Atlashcl supports
const langIds = {
  schema: {
    sqlite: genSchemaLangId(Dialect.sqlite),
    mysql: genSchemaLangId(Dialect.mysql),
    postgresql: genSchemaLangId(Dialect.postgresql),
  },
  config: genConfigLangId()
}

// Register all languages that atlashcl supports to the monaco instance 
function AutoRegister(monaco : typeof Monaco) {
  RegisterSchema(monaco, Dialect.mysql)
  RegisterSchema(monaco, Dialect.postgresql)
  RegisterSchema(monaco, Dialect.sqlite)
  RegisterConfig(monaco)
}

// Register AtlasHCL Schema to monaco
function RegisterSchema(monaco : typeof Monaco, dialect : Dialect) {
  const hclNavigator = new HCLNavigator(Schema[dialect], schemaConfig)
  const codeCompletion = new CodeCompletion(hclNavigator)
  const atlashcl = new AtlasHCL(codeCompletion)
  
  RegisterBase(monaco, atlashcl, genSchemaLangId(dialect))
  langInternalRegistry[genSchemaLangId(dialect)] = {
    hclNavigator: hclNavigator
  }
}

// Register AtlasHCL Config to monaco
function RegisterConfig(monaco: typeof Monaco) {
  const hclNavigator = new HCLNavigator(Config)
  const codeCompletion = new CodeCompletion(hclNavigator)
  const atlashcl = new AtlasHCL(codeCompletion)
  
  RegisterBase(monaco, atlashcl, genConfigLangId())
  langInternalRegistry[genConfigLangId()] = {
    hclNavigator: hclNavigator
  }
}

function RegisterBase(monaco: typeof Monaco, atlashcl : AtlasHCL, langId : string) {
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
    atlashcl.getCodeCompletionProvider()
  )
}

/* 
  ============= Support @monaco-editor/react =============
*/

type Registry = {
  hclNavigator: HCLNavigator,
}

// eslint-disable-next-line prefer-const
let langInternalRegistry : Record<string, Registry> = {}

const linterProvider = (monaco : typeof Monaco) => {
  const hclTokenizer  = new HCLTokenizer(monaco)
  
  return (langId: string) => {
    const hclNavigator = langInternalRegistry[langId]?.hclNavigator
    return  new Linter(hclNavigator, hclTokenizer)
  }
}

function ConnectReactEditor(editor : Monaco.editor.IStandaloneCodeEditor, monaco : typeof Monaco) {
  const atlasHclEditor = new Editor(editor, linterProvider(monaco))
  atlasHclEditor.init()
}

/* 
  =========================================================
*/

export {
  langIds,
  AutoRegister,
  RegisterSchema,
  RegisterConfig,
  RegisterBase,
  ConnectReactEditor,
  linterProvider
}