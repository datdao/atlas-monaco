import * as monaco from 'monaco-editor';
import { Dialect } from "../dialect";
declare class CodeCompletion {
    private hclTmpl;
    constructor(dialect: Dialect, hclTmpl?: Object);
    items(): monaco.languages.CompletionItemProvider;
    buildCompletionItems(scopes?: string[], hclTmpl?: Object): any[];
    buildGlobalSearchCompletionItems(): any;
    buildResourceCompletionTemplate(range: monaco.IRange, key: string): {
        label: string;
        kind: monaco.languages.CompletionItemKind;
        detail: string;
        insertText: string;
        insertTextRules: monaco.languages.CompletionItemInsertTextRule;
        range: monaco.IRange;
    };
    buildReferenceCompletionTemplate(range: monaco.IRange, key: string): {
        label: string;
        kind: monaco.languages.CompletionItemKind;
        insertText: string;
        insertTextRules: monaco.languages.CompletionItemInsertTextRule;
        range: monaco.IRange;
    };
    buildAttrDefaultCompletionTemplate(range: monaco.IRange, key: string): {
        label: string;
        kind: monaco.languages.CompletionItemKind;
        insertText: string;
        insertTextRules: monaco.languages.CompletionItemInsertTextRule;
        range: monaco.IRange;
    };
    buildAttrValueCompletionTemplate(range: monaco.IRange, key: string, value: string): {
        label: string;
        kind: monaco.languages.CompletionItemKind;
        insertText: string;
        insertTextRules: monaco.languages.CompletionItemInsertTextRule;
        range: monaco.IRange;
    };
    buildValueCompletionTemplate(range: monaco.IRange, key: string): {
        label: string;
        kind: monaco.languages.CompletionItemKind;
        insertText: string;
        insertTextRules: monaco.languages.CompletionItemInsertTextRule;
        range: monaco.IRange;
    };
    isValidScope(scopes?: string[], definedScopes?: string[]): boolean;
}
export default CodeCompletion;
