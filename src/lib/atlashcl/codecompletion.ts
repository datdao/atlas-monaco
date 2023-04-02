import * as monaco from 'monaco-editor';
import { HCLParser } from './hcl/parser';
import { ICodeCompletion } from '.';
import { Suggestion, SuggestionType } from './hcl/hcl';

interface IHCLNavigator {
	listSuggestionByNestedScopes(nestedScopes: string[]) : Suggestion[]
}

class CodeCompletion implements ICodeCompletion {
	private hclNavigator: IHCLNavigator

    constructor(hclNavigator : IHCLNavigator) {
		this.hclNavigator = hclNavigator
	}

	getProvider(): monaco.languages.CompletionItemProvider {
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
				const hclParser =  new HCLParser(textModel, position)
				const range = hclParser.getWordRange()
				const suggestions = listSuggestionByNestedScopes(hclParser.listNestedScopes())
				
				let nestedScopes = hclParser.parseCurrentWordToNestedScopes()
				
				if((context.triggerKind == 1 && context.triggerCharacter == ".") || nestedScopes.length > 0) {
					const suggestionLvl0 = listSuggestionByNestedScopes([])
					const blocks = hclParser.findParentBlocks()
					
					
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
			}
		}
	}

	buildCompletionItems(suggestions : Suggestion[] = [], range : monaco.IRange) : any[] {
		const completionItems : any = []
		
		suggestions.forEach((suggestion : Suggestion) => {
			switch (suggestion.type) {
				case SuggestionType.block:
					completionItems.push(this.buildBlockTemplate(suggestion.value, range, suggestion.config))
					break;
				case SuggestionType.attribute:
					completionItems.push(this.buildAttributeTemplate(suggestion.value, range, suggestion.config))
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
			insertText: addCursorIndexToQuestionMarks(key + ' ' + name +' {\n\t${?}\n}'),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Build Block template
	buildReferenceTemplate(key : string, range : monaco.IRange = null) {
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Method,
			insertText: addCursorIndexToQuestionMarks(key),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Build attribute template
	buildAttributeTemplate(key : string, range : monaco.IRange = null, config?: any) {
		const value = config?.autoGenValue ? config.autoGenValue + '\n${?}' : ''
		return {
			label: key,
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: addCursorIndexToQuestionMarks(key + ' = ' + value),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}

	// Value template
	buildValueTemplate(key : string, range : monaco.IRange = null) {
		return {
			label: key.replace(/\$\{\S\}/g, "?"),
			kind: monaco.languages.CompletionItemKind.Variable,
			insertText: addCursorIndexToQuestionMarks(key + '\n${?}'),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		}
	}
}

export function addCursorIndexToQuestionMarks(text : any) {
    let count = 1
	return text.replace(/\?/g, (match: any, offset : any, str: any) => {
		if (offset === str.lastIndexOf('?')) {
			return '0';
		}
		return count++
	})

     
}

export default CodeCompletion
