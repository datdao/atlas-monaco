import * as Monaco from 'monaco-editor';

export const enum TokenType {
    // eslint-disable-next-line no-unused-vars
    empty = "",
    // eslint-disable-next-line no-unused-vars
    string = "string.hcl",
    // eslint-disable-next-line no-unused-vars
    comment = "comment.hcl"
}

export class HCLTokenizer {
    private monaco : typeof Monaco
    
    constructor(monaco : typeof Monaco) {
        this.monaco = monaco
    }

    convertTokenToRanges(textModel : Monaco.editor.ITextModel) : Record<string, Monaco.IRange[]> {
        const tokens = this.monaco.editor.tokenize(textModel.getValue(), textModel.getLanguageId())
        const tokenRanges : Record<string, Monaco.IRange[]> = {}
        if (tokens == null) return tokenRanges

        tokens.forEach((lineTokens, idx) => {
            const lineNumber = idx + 1
            if (lineTokens.length == 0) {
                this.setValueToTokenRanges(tokenRanges, TokenType.empty, new Monaco.Range(lineNumber, 1, lineNumber, 1))
                return
            }

            if (lineTokens.length == 1) {
                this.setValueToTokenRanges(
                    tokenRanges, 
                    lineTokens[0].type, 
                    new Monaco.Range(lineNumber, lineTokens[0].offset + 1, lineNumber, textModel.getLineMaxColumn(lineNumber)))
                return
            }

            for (let index = 0; index < lineTokens.length; index ++) {
                if (index == lineTokens.length - 1) {
                    this.setValueToTokenRanges(
                        tokenRanges, 
                        lineTokens[index].type, 
                        new Monaco.Range(lineNumber, lineTokens[index].offset + 1, lineNumber, textModel.getLineMaxColumn(lineNumber)))
                        break
                }

                this.setValueToTokenRanges(
                    tokenRanges, 
                    lineTokens[index].type, 
                    new Monaco.Range(lineNumber, lineTokens[index].offset + 1, lineNumber, lineTokens[index + 1].offset + 1))
            }
        })

        return tokenRanges
    }

    setValueToTokenRanges(tokenRanges : Record<string, Monaco.IRange[]> = {}, tokenType: string, range: Monaco.IRange) {
        if (tokenRanges[tokenType] == null) {
            tokenRanges[tokenType] = [range]
        }

        tokenRanges[tokenType].push(range)
    }

    getRangesByTokenType(textModel : Monaco.editor.ITextModel, tokenTypes : TokenType[]) {
        const tokenRanges = this.convertTokenToRanges(textModel)
        let ranges : Monaco.IRange[] = []

        Object.keys(tokenRanges).forEach((tokenType) => {
            if (tokenTypes.includes(tokenType as TokenType)) {
                ranges = [...ranges, ...tokenRanges[tokenType]]
            }
        });

        return ranges
    }
}