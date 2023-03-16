import * as monaco from 'monaco-editor';
import sql, { resourceConfig } from '../data/sql';
import { Dialect } from "../dialect";
import { decrementingCursorPosition } from "./util";
import HclParser from './hclparser';

class CodeCompletion {
	private hclTmpl: any;

    constructor(dialect : Dialect, hclTmpl : any = sql) {
		this.hclTmpl = hclTmpl[dialect]

	}

	items(): monaco.languages.CompletionItemProvider {
		const completionItems = this.buildCompletionItems()
		const globalCompletionItems = this.buildGlobalSearchCompletionItems()

		return {
			triggerCharacters: ["."],
			provideCompletionItems(
				textModel : monaco.editor.ITextModel,
				position : monaco.Position,
				context : monaco.languages.CompletionContext) : monaco.languages.ProviderResult<monaco.languages.CompletionList> {

				const hclParser = new HclParser(textModel, position)
				const range = hclParser.getWordRange()
				const resources = hclParser.listBlockScope()
				
				if((context.triggerKind == 1 && context.triggerCharacter == ".")) {
					const path = hclParser.parseCurrentWordToPath()
					const referencedResourceValues = hclParser.findReferencedResourceValues(path)
					const completionItems = globalCompletionItems(referencedResourceValues)		
								
					return {
						suggestions: completionItems.filter((completionItem : any) => {
							return completionItem(range, resources) != null
						}).map((completionItem : any) => {
							return completionItem(range, resources)
						}),
					}
				}
					
				return {
					suggestions: completionItems.filter((completionItem) => {
						return completionItem(range, resources) != null
					}).map((completionItem) => {
						return completionItem(range, resources)
					}),
				};
			},
		}
	}

	buildCompletionItems(scopes : string[] = [], hclTmpl : any = null) : any[] {
		const completionItems : any[] = []

		if (hclTmpl == null) {
			hclTmpl= this.hclTmpl
		}

		Object.entries(hclTmpl).forEach(([key, value]) => {	
			const definedScopes = [...scopes]

			scopes.push(key)
			
			if (Object.prototype.toString.call(value) === '[object Object]') {
				
				// Push Resource completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => {
					return this.isValidScope(scopes, definedScopes) ? 
					this.buildResourceCompletionTemplate(range, key, resourceConfig[[...scopes,key].join(".")]) : undefined
				})

				
				// [IMPORTANT] trigger recursion
				completionItems.push(...this.buildCompletionItems([...scopes], value))
				
				scopes = scopes.filter((item) => item !== key)

				return completionItems
			}

			// Push Value completion Items
			if (Object.prototype.toString.call(value) === '[object Array]') {
				// Push Attribute completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.isValidScope(scopes, definedScopes) ? 
					this.buildAttrDefaultCompletionTemplate(range, key) : null
				})

				const valueDefinedScopes = [...scopes]
				
				Object.entries(value).forEach(([idx]) => {
					completionItems.push((range : monaco.IRange, resources: string[]) => { 
						return this.isValidScope(resources, valueDefinedScopes) ?
						this.buildValueCompletionTemplate(range, value[idx]) : null
					})
				})
			}
			
			if (Object.prototype.toString.call(value) === '[object String]') {
				// Push Attribute completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.isValidScope(scopes, definedScopes) ? 
					this.buildAttrValueCompletionTemplate(range, key, value as string) : null
				})
			}

			scopes = scopes.filter((item) => {
				return item !== key
			})
			
		});

		return completionItems
	}

	buildGlobalSearchCompletionItems() : any {
		return (referencedValue : string[]) => {
			const completionItems : any[] = []

			referencedValue.forEach((v) => {
				completionItems.push((range : monaco.IRange) => { 
					return this.buildReferenceCompletionTemplate(range, v)
				})
			})

			return completionItems
		}
	}

	// Resource template
	buildResourceCompletionTemplate(range : monaco.IRange, key : string, config: any = null) {
		
		const name = (config?.allowNullName ? '' : '"${?}"')
		console.log(config)
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			detail: "",
			insertText: decrementingCursorPosition(key + ' ' + name +' {\n\t${?}\n}'),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Resource template
	buildReferenceCompletionTemplate(range : monaco.IRange = null, key : string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			insertText: decrementingCursorPosition(key),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Attribute template
	buildAttrDefaultCompletionTemplate(range : monaco.IRange, key : string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: decrementingCursorPosition(key + ' = '),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Attribute template
	buildAttrValueCompletionTemplate(range : monaco.IRange, key : string, value: string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: decrementingCursorPosition(key + " = " + value + "\n${?}"),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Value template
	buildValueCompletionTemplate(range : monaco.IRange, key : string) {
		return {
			label: key.replace(/\$\{\S\}/g, "?"),
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: decrementingCursorPosition(key + '\n${?}'),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	isValidScope(scopes : string[] = [], definedScopes : string[] = []) : boolean {	
		if (scopes.length != definedScopes.length) {
			return false
		}

		for (let i = 0; i < scopes.length; i++) {
			if (scopes[i] !== definedScopes[i]) {
				return false;
			}
		}
		return true
	}

	
}

export default CodeCompletion
