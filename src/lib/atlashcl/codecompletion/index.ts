import * as monaco from 'monaco-editor';
import HclParser from '../hclparser';
import { ICodeCompletion } from '..';
import { Suggestion, SuggestionType } from '../hcl';

interface IHCLNavigator {
	// eslint-disable-next-line no-unused-vars
	listSuggestionByNestedScopes(nestedScopes: string[]) : Suggestion[]
}

class CodeCompletion implements ICodeCompletion {
	private hclNavigator: IHCLNavigator

    constructor(hclNavigator : IHCLNavigator) {
		this.hclNavigator = hclNavigator
	}

	getProvider(): monaco.languages.CompletionItemProvider {
		let currentNestedScopes : string[] = []

		const listSuggestionByNestedScopes = (nestedScopes : string[]) => {
			return this.hclNavigator.listSuggestionByNestedScopes(nestedScopes)
		}
		const buildCompletionItems = (suggestions : Suggestion[], range : monaco.IRange) => {
			return this.buildCompletionItems(suggestions, range)
		}

		const buildGlobalSearchItems = (referencedBlockValues : string[], range : monaco.IRange) => {
			return this.buildGlobalSearchItems(referencedBlockValues, range)
		}

		return {
			triggerCharacters: ["."],
			provideCompletionItems(
				textModel : monaco.editor.ITextModel,
				position : monaco.Position,
				context : monaco.languages.CompletionContext) : monaco.languages.ProviderResult<monaco.languages.CompletionList> {
				const hclParser = new HclParser(textModel, position)
				const range = hclParser.getWordRange()
				currentNestedScopes = hclParser.listNestedScopes()
				const suggestions = listSuggestionByNestedScopes(currentNestedScopes)
				

				if(context.triggerKind == 1 && context.triggerCharacter == ".") {
					const suggestionLvl0 = listSuggestionByNestedScopes([])
					const blocks = hclParser.findParentBlocks()
					let nestedScopes = hclParser.parseCurrentWordToNestedScopes()
					

					// correct relative scopes
					if (nestedScopes.length > 0 && !suggestionLvl0.find((v) => v.value == nestedScopes[0])){
						nestedScopes = [blocks[0]?.block, blocks[0]?.values[0], ...nestedScopes]
					}
					
					const referencedBlockValues = hclParser.findReferencedBlockValues(nestedScopes)
					return {suggestions: buildGlobalSearchItems(referencedBlockValues, range)}
				}
					
				return {
					suggestions: buildCompletionItems(suggestions, range)
				};
			},
			resolveCompletionItem(item) {
				const suggestions = listSuggestionByNestedScopes([...currentNestedScopes, item.label.toString()])
				if (suggestions != null && suggestions.length == 1 && suggestions[0].type == SuggestionType.attributeValue) {
					item.insertText = decrementingCursorPosition(item.insertText + " " + suggestions[0].value + "\n${?}")
				}
				
				return item
			},
			
		}
	}

	buildCompletionItems(suggestions : Suggestion[], range : monaco.IRange) : any[] {
		const completionItems : any = []

		suggestions.forEach((suggestion : Suggestion) => {
			switch (suggestion.type) {
				case SuggestionType.block:
					completionItems.push(this.buildBlockTemplate(suggestion.value, range, suggestion.config))
					break;
				case SuggestionType.attribute:
					completionItems.push(this.buildAttributeTemplate(suggestion.value, range))
					break;
				case SuggestionType.attributeValue:
					completionItems.push(this.buildValueTemplate(suggestion.value, range))
					break;
			}
		})

		return completionItems
	}

	buildGlobalSearchItems(referencedValues: string[], range : monaco.IRange = null) : any {
		const completionItems : any[] = []
		referencedValues.forEach((referencedValue) => {
			completionItems.push(this.buildReferenceTemplate(referencedValue, range))
		})

		return completionItems
	}

	// Block template
	buildBlockTemplate(key : string, range : monaco.IRange = null, config: any = null) {
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

	// Build Block template
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
	buildAttributeTemplate(key : string, range : monaco.IRange = null) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: decrementingCursorPosition(key + ' = '),
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
}

export function decrementingCursorPosition(text : any) {
    let count = text.split('?').length - 2;
    return text.replace(/\?/g, () => count--);
}

export default CodeCompletion
