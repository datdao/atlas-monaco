import { LANGUAGE, EXTENTIONS, MYSQL } from "./constants"
import {getCompletionItems} from "./auto-completion"
import {conf, language} from "monaco-editor/esm/vs/basic-languages/hcl/hcl"

export function getLanguageName() {
  return LANGUAGE
}

export function getLanguageExtension() {
  return {
    id: LANGUAGE, // The language identifier
    extensions: EXTENTIONS, // The file extensions associated with the language
  }
}

export function getLanguageConfiguration() {
  return conf
}

export function getTokenProvider() {
  return language
}

export function getCompletionProvider(sqlDialect = MYSQL) {
  return getCompletionItems(sqlDialect)
}

