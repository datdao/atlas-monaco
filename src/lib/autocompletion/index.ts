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

	getProvider(): monaco.languages.CompletionItemProvider {
		const completionItems = this.buildItems()
		const globalCompletionItems = this.buildGlobalSearchItems()
		const rootResources = Object.keys(this.hclTmpl)

		return {
			triggerCharacters: ["."],
			provideCompletionItems(
				textModel : monaco.editor.ITextModel,
				position : monaco.Position,
				context : monaco.languages.CompletionContext) : monaco.languages.ProviderResult<monaco.languages.CompletionList> {

				const hclParser = new HclParser(textModel, position)
				const range = hclParser.getWordRange()
				const scopes = hclParser.listScopes()
				
				
				if((context.triggerKind == 1 && context.triggerCharacter == ".")) {
					const resources = hclParser.findParentResources()
					let path = hclParser.parseCurrentWordToPath()

					// correct relative path
					if (path.length > 0 && !rootResources.includes(path[0])){
						path = [resources[0]?.resource,resources[0]?.values[0], ...path]
					}

					const referencedResourceValues = hclParser.findReferencedResourceValues(path)
					const completionItems = globalCompletionItems(referencedResourceValues)		
								
					return {
						suggestions: completionItems.filter((completionItem : any) => {
							return completionItem(range, scopes) != null
						}).map((completionItem : any) => {
							return completionItem(range, scopes)
						}),
					}
				}
					
				return {
					suggestions: completionItems.filter((completionItem) => {
						return completionItem(range, scopes) != null
					}).map((completionItem) => {
						return completionItem(range, scopes)
					}),
				};
			},
		}
	}

	buildItems(scopes : string[] = [], hclTmpl : any = null) : any[] {
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
					this.buildResourceTemplate(key, range, resourceConfig[[...scopes,key].join(".")]) : undefined
				})

				
				// [IMPORTANT] trigger recursion
				completionItems.push(...this.buildItems([...scopes], value))
				
				scopes = scopes.filter((item) => item !== key)

				return completionItems
			}

			// Push Value completion Items
			if (Object.prototype.toString.call(value) === '[object Array]') {
				// Push Attribute completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.isValidScope(scopes, definedScopes) ? 
					this.buildAttrDefaultTemplate(key, range) : null
				})

				const valueDefinedScopes = [...scopes]
				
				Object.entries(value).forEach(([idx]) => {
					completionItems.push((range : monaco.IRange, resources: string[]) => { 
						return this.isValidScope(resources, valueDefinedScopes) ?
						this.buildValueTemplate(value[idx], range) : null
					})
				})
			}
			
			if (Object.prototype.toString.call(value) === '[object String]') {
				// Push Attribute completion Items
				completionItems.push((range : monaco.IRange, scopes: string[]) => { 
					return this.isValidScope(scopes, definedScopes) ? 
					this.buildAttrValueTemplate(key, value as string, range) : null
				})
			}

			scopes = scopes.filter((item) => {
				return item !== key
			})
			
		});

		return completionItems
	}

	buildGlobalSearchItems() : any {
		return (referencedValues : string[]) => {
			const completionItems : any[] = []

			referencedValues.forEach((referencedValue) => {
				completionItems.push((range : monaco.IRange) => { 
					return this.buildReferenceTemplate(referencedValue, range)
				})
			})

			return completionItems
		}
	}

	// Resource template
	buildResourceTemplate(key : string, range : monaco.IRange = null, config: any = null) {
		const name = (config?.allowNullName ? '' : '"${?}"')
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			detail: "",
			insertText: decrementingCursorPosition(key + ' ' + name +' {\n\t${?}\n}'),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Build Resource template
	buildReferenceTemplate(key : string, range : monaco.IRange = null) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			insertText: decrementingCursorPosition(key),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Build attribute template
	buildAttrDefaultTemplate(key : string, range : monaco.IRange = null) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: decrementingCursorPosition(key + ' = '),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Build Template with attribute and value
	buildAttrValueTemplate(key : string, value: string, range : monaco.IRange = null) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: decrementingCursorPosition(key + " = " + value + "\n${?}"),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Value template
	buildValueTemplate(key : string, range : monaco.IRange = null) {
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
