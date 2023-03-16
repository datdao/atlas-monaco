import { AutoRegisterToMonaco } from "../lib";
import { Dialect, getDialectKeyPair } from "../lib/dialect";
import "./index.css";
import * as monaco from 'monaco-editor';

// Create the select element
const select = document.createElement('select');

// Add options to the select element
select.innerHTML = Object.entries(getDialectKeyPair()).map((value) => `
  <option value="${value[0]}">${value[1]}</option>
`).join('');

// Append the select element to the body element
document.body.appendChild(select);

// Auto register config to Monaco Editor and return func to register again
const { registerCompletionItemProvider } = AutoRegisterToMonaco(Dialect.mysql)

// On change Dialect
select.addEventListener('change', event => {
    const target = event.target as HTMLInputElement
    registerCompletionItemProvider(target.value as Dialect)
    console.log(`Selected value: ${target.value}`);
});

// Generate UI
const div = document.createElement('div');
div.id = "editorContainer"

document.body.appendChild(div);

monaco.editor.create(document.getElementById("editorContainer") as HTMLElement, {
    theme: 'vs',
    language: 'atlashcl',
    value: "# Hello\n",
    dimension: {
        height: 1000, // set the height of the editor to 400 pixels
        width: 1000
    }
});
