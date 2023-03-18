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
			
			switch (Object.prototype.toString.call(value)) {
				case '[object Object]':
					// Push Resource completion Items
					completionItems.push(this.buildResourceItem(key, definedScopes))
					
					// [IMPORTANT] trigger recursion
					completionItems.push(...this.buildItems([...scopes], value))
					break;
				case '[object Array]':
					// Push Attribute completion Items
					completionItems.push(this.buildAttributeItem(key, "", definedScopes))
					
					Object.entries(value).forEach(([idx]) => {
						completionItems.push(this.buildValueItem(value[idx], scopes))
					})
					break;
				case '[object String]':
					completionItems.push(this.buildAttributeItem(key, value as string, definedScopes))
					break;
				default: 
					break;
			}

			scopes = scopes.filter((scope) => {
				return scope !== key
			})
		});

		return completionItems
	}

	buildResourceItem(key:string, definedScopes: string[]) {
		return (range : monaco.IRange, currentScopes: string[]) => { 
			return this.isValidScope(currentScopes, definedScopes) ? 
			this.buildResourceTemplate(key, range, resourceConfig[[...definedScopes,key].join(".")]) : null
		}
	}

	buildAttributeItem(key:string, value: string, definedScopes: string[]) {
		return (range : monaco.IRange, currentScopes: string[]) => {
			if (!this.isValidScope(currentScopes, definedScopes)) {
				return null
			}

			return value == "" ? this.buildAttrDefaultTemplate(key, range) : this.buildAttrValueTemplate(key, value, range)
		}
	}

	buildValueItem(key:string, definedScopes: string[]) {
		return (range : monaco.IRange, currentScopes: string[]) => { 
			return this.isValidScope(currentScopes, definedScopes) ? 
			this.buildValueTemplate(key, range) : null
		}
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
