import * as monaco from 'monaco-editor';
import { sql } from '../data/sql';
import { Dialect } from "../dialect";
import HclParser from './hclparser';

class CodeCompletion {
	private hclTmpl: Object;

    constructor(dialect : Dialect) {
		this.hclTmpl = sql[dialect]
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

				let hclParser = new HclParser(textModel, position)
				let range = hclParser.wordRange()
				let resources = hclParser.listBlockScope()
				
				if((context.triggerKind == 1 && context.triggerCharacter == ".")) {
					let path = hclParser.parseCurrentWordToPath()
					let referencedResourceValues = hclParser.findReferencedResourceValues(path)
					let completionItems = globalCompletionItems(referencedResourceValues)		
								
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

	getRootResources(): string[] {
		return Object.keys(this.hclTmpl)
	}

	buildCompletionItems(scopes : string[] = [], hclTmpl : Object = null) : any[] {
		let completionItems : any[] = []

		if (hclTmpl == null) {
			hclTmpl= this.hclTmpl
		}

		Object.entries(hclTmpl).forEach(([key, value]) => {	
			let definedScopes = [...scopes]

			scopes.push(key)
			
			if (Object.prototype.toString.call(value) === '[object Object]') {
				
				// Push Resource completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => {
					return this.isValidScope(scopes, definedScopes) ? this.buildResourceCompletionTemplate(range, key) : undefined
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
					return this.isValidScope(scopes, definedScopes) ? this.buildAttrValueCompletionTemplate(range, key, "") : null
				})

				let valueDefinedScopes = [...scopes]
				Object.entries(value).forEach(([k, v]) => {
					completionItems.push((range : monaco.IRange, resources: string[]) => { 
						return this.isValidScope(resources, valueDefinedScopes) ? this.buildValueCompletionTemplate(range, v as string) : null
					})
				})
			} else if (Object.prototype.toString.call(value) === '[object String]' && value != "") {
				// Push Attribute completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.isValidScope(scopes, definedScopes) ? this.buildAttrValueCompletionTemplate(range, key, value) : null
				})
			} else {
				// Push Attribute completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.isValidScope(scopes, definedScopes) ? this.buildAttrDefaultCompletionTemplate(range, key) : null
				})
			}

			scopes = scopes.filter((item) => {
				return item !== key
			})
			
		});

		return completionItems
	}

	buildGlobalSearchCompletionItems() : any {
		return (valueReferenced : string[]) => {
			let completionItems : any[] = []

			valueReferenced.forEach((v) => {
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.buildReferenceCompletionTemplate(range, v)
				})
			})

			return completionItems
		}
	}

	// Resource template
	buildResourceCompletionTemplate(range : monaco.IRange, key : string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			detail: "",
			insertText: key + ' "${1}" {\n\t${0}\n}',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Resource template
	buildReferenceCompletionTemplate(range : monaco.IRange, key : string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			insertText: key,
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Attribute template
	buildAttrDefaultCompletionTemplate(range : monaco.IRange, key : string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: key + ' = "${1}"\n${0}',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Attribute template
	buildAttrValueCompletionTemplate(range : monaco.IRange, key : string, value: string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: key + ' = ' + value,
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Value template
	buildValueCompletionTemplate(range : monaco.IRange, key : string) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: key + '\n${0}',
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
