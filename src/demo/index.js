import _ from './index.css';
import * as monaco from 'monaco-editor';
import * as atlashcl from '../lib';

// Generate monaco editor to html element
var editor = monaco.editor.create(document.querySelector("body"), {
    theme: 'vs-dark',
    language: atlashcl.getLanguageName()
});

// Register new language 
monaco.languages.register(atlashcl.getLanguageExtension())

// Set Tokenizer vs Language config
monaco.languages.setLanguageConfiguration(atlashcl.getLanguageName(), atlashcl.getLanguageConfiguration())
monaco.languages.setMonarchTokensProvider(atlashcl.getLanguageName(), atlashcl.getTokenProvider())

// Register completion logic
monaco.languages.registerCompletionItemProvider(atlashcl.getLanguageName(),atlashcl.getCompletionProvider())


