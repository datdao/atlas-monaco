import { Suggestion, SuggestionType } from "../hcl/hcl";
import * as monaco from 'monaco-editor';
import { errors } from "./errors";
import { HCLParser } from "../hcl/parser";
import { isOverlap, isPositionInsideRange } from "../utils";
import { TokenType } from "../hcl/tokenizer";

interface IHCLNavigator {
	listSuggestionByNestedScopes(nestedScopes: string[]) : Suggestion[]
}

interface ITokenizer {
	getRangesByTokenType(textModel : monaco.editor.ITextModel, tokenTypes : TokenType[]) : monaco.IRange[]
}

class Linter {
    private hclNavigator: IHCLNavigator
    private hclTokenizer: ITokenizer

    constructor(hclNavigator : IHCLNavigator, hclTokenizer: ITokenizer) {
		this.hclNavigator = hclNavigator
        this.hclTokenizer = hclTokenizer
	}

    validateNonCompliantWord(textModel: monaco.editor.ITextModel, position : monaco.Position) :  monaco.editor.IModelDeltaDecoration {
        const hclParser = new HCLParser(textModel, position)
        const nestedScopes = hclParser.listNestedScopes()
        const suggestions = this.hclNavigator.listSuggestionByNestedScopes(nestedScopes)
        const wordUntilPosition = textModel.getWordUntilPosition({
            lineNumber: position.lineNumber,
            column: position.column + 1
        })
        const word = wordUntilPosition?.word.trim()
        
        const isDefaultAttributeValue = (
            suggestions.length == 1 && 
            suggestions[0].type ==  SuggestionType.attributeValue
        )
            
        if (!word || isDefaultAttributeValue) return

        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: wordUntilPosition.startColumn,
            endColumn: wordUntilPosition.endColumn
        }
        
        const isTypeNonCompliantWord = suggestions.find((suggestion) => {
            return  suggestion.value.startsWith(word) || suggestion.value.toLowerCase().startsWith(word)
        }) == null

        if (isTypeNonCompliantWord == true) {
            
            const parentBlock = hclParser.findParentBlock(position)?.block;
            if (!parentBlock) {
                return this.buildWarningMarker(range, errors.nonCompliantResource(word))
            }

            // Set the decorations on the model
            return !(suggestions[0]?.type == SuggestionType.attributeValue) ? 
                this.buildWarningMarker(range, errors.nonCompliantAttr(parentBlock, word)) :
                this.buildWarningMarker(range, errors.nonCompliantValue(nestedScopes[nestedScopes.length - 1], word))
        }

        return
    }

    validateNonCompliantWordAll(textModel: monaco.editor.ITextModel) : monaco.editor.IModelDeltaDecoration[] {
        const decorations : monaco.editor.IModelDeltaDecoration[] = []
        const skippedRanges = this.findSkippedRanges(textModel)
        
        for(let line = 1; line <= textModel.getLineCount(); line++) {
            for(let column = 1; column <= textModel.getLineMaxColumn(line) ; column++) {
                const position : any = {
                    lineNumber: line,
                    column: column
                }
                
                // Skip areas that don't need to lint
                const skippedRange = skippedRanges.find((range) => isPositionInsideRange(position, range))
                if (skippedRange != null) {
                    continue
                }

                const decoration = this.validateNonCompliantWord(textModel, position)
                if (decoration != null) {
                    // clear overlap decoration
                    if (decorations.length > 0 && isOverlap(decoration?.range, decorations[decorations.length - 1]?.range)) {
                        decorations.pop()
                    }

                    decorations.push(decoration)
                }
            }
        }

        return decorations
    }

    validateNonCompliantWordLine(textModel: monaco.editor.ITextModel, lineNumber : number) :  monaco.editor.IModelDeltaDecoration[] {
        const decorations : monaco.editor.IModelDeltaDecoration[] = []
        const skippedRanges = this.findSkippedRanges(textModel)
        if (!textModel.getLineContent(lineNumber).trim()) return []

        
        for(let column = 1; column <= textModel.getLineContent(lineNumber).length ; column++) {
            const position : any = {
                lineNumber: lineNumber,
                column: column
            }

            // Skip areas that don't need to lint
            const skippedRange = skippedRanges.find((range) => isPositionInsideRange(position, range))
            if (skippedRange != null) {
                continue
            }

            const decoration = this.validateNonCompliantWord(textModel, position)
            if (decoration != null) {
                // clear overlap decorations
                if (decorations.length > 0 && isOverlap(decoration.range, decorations[decorations.length-1].range)) {
                    decorations.pop()
                }
                
                decorations.push(decoration)
            }
        }
        
        return decorations
    }

    findSkippedRanges(textModel: monaco.editor.ITextModel) : monaco.IRange[] {
        const ranges = this.hclTokenizer.getRangesByTokenType(textModel, [TokenType.empty, TokenType.string, TokenType.comment])
        return ranges
    }

    buildWarningMarker(range: monaco.IRange, msg: string) {
        return {
            range: range,
            options: {
                isWholeLine: false,
                className: "squiggly-error",
                hoverMessage: {
                    value: msg
                },
                ownerId: 10
            }
        }
    }
}

export default Linter