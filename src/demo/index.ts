import AtlasHcl, {AutoRegisterToMonaco} from "../lib";
import { Dialect, getDialectKeyPair } from "../lib/dialect";
import "./index.css";
import * as monaco from 'monaco-editor';

// Create the select element
const select = document.createElement('select');

// Add options to the select element
select.innerHTML = `
    <option value="${Dialect.sql}">${Dialect.sql}</option>
    <option value="${Dialect.mysql}">${Dialect.mysql}</option>
    <option value="${Dialect.postges}">${Dialect.postges}</option>
`;

// Add options to the select element
select.innerHTML = Object.entries(getDialectKeyPair()).map((value) => `
  <option value="${value[0]}">${value[1]}</option>
`).join('');

// Append the select element to the body element
document.body.appendChild(select);

// Auto register config to Monaco Editor and return func to register again
const { registerCompletionItemProvider } = AutoRegisterToMonaco(Dialect.sql)

// On change Dialect
select.addEventListener('change', event => {
    registerCompletionItemProvider(event?.target?.value)
    console.log(`Selected value: ${event?.target?.value}`);
});

// Generate UI
const div = document.createElement('div');
document.body.appendChild(div);

monaco.editor.create(document.querySelector("body") as HTMLElement, {
    theme: 'vs-dark',
    language: 'atlashcl'
});