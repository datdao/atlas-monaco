import {HCLTokenizer, TokenType} from '../../../atlashcl/hcl/tokenizer';
import * as mocks from "../../testdata/model";

const hclTokenizer = new HCLTokenizer(mocks.monaco as any)

describe('tokenizer', () => {
    describe('convertTokenToRanges', () => {
        test('default', () => {
            const result = hclTokenizer.convertTokenToRanges(mocks.textModel as any)
            expect(result).toEqual({})
        })

        test('tokenize with comment token', () => {
            mocks.monaco.editor.tokenize.mockReturnValue([[
                {
                    "type": "comment.hcl",
                    offset: 1
                }
            ]])
            const result = hclTokenizer.convertTokenToRanges(mocks.textModel as any)
            expect(result).toEqual({
                "comment.hcl": [
                    {
                        "endColumn": 0,
                        "endLineNumber": 1,
                        "startColumn": 2,
                        "startLineNumber": 1,
                    }
                ]
            
            })
        })

        test('tokenize with empty token', () => {
            mocks.monaco.editor.tokenize.mockReturnValue([[]])
            const result = hclTokenizer.convertTokenToRanges(mocks.textModel as any)
            expect(result).toEqual({
                "": [
                    {
                        "endColumn": 1,
                        "endLineNumber": 1,
                        "startColumn": 1,
                        "startLineNumber": 1,
                    }
                ]
            })
        })

        test('tokenize with 2 comment token', () => {
            mocks.monaco.editor.tokenize.mockReturnValue([[
                {
                    "type": "comment.hcl",
                    offset: 1
                },
                {
                    "type": "comment.hcl",
                    offset: 5
                }
                
            ]])
            const result = hclTokenizer.convertTokenToRanges(mocks.textModel as any)
            expect(result).toEqual({
                "comment.hcl": [
                    {
                        "endColumn": 6,
                        "endLineNumber": 1,
                        "startColumn": 2,
                        "startLineNumber": 1,
                    },
                    {
                        "endColumn": 0,
                        "endLineNumber": 1,
                        "startColumn": 6,
                        "startLineNumber": 1,
                    }
                ]
            
            })
        })
    })

    describe('getRangesByTokenType', () => {
        test('default', () => {
            mocks.monaco.editor.tokenize.mockReturnValue([[
                {
                    "type": "comment.hcl",
                    offset: 1
                }
            ]])
            const result = hclTokenizer.getRangesByTokenType(mocks.textModel as any,["comment.hcl"] as TokenType[])
            expect(result).toEqual([{
                "endColumn": 0,
                "endLineNumber": 1,
                "startColumn": 2,
                "startLineNumber": 1,
            }])
        })

        test('not match with tokenType', () => {
            mocks.monaco.editor.tokenize.mockReturnValue([[
                {
                    "type": "comment.hcl",
                    offset: 1
                }
            ]])
            const result = hclTokenizer.getRangesByTokenType(mocks.textModel as any,["string.hcl"] as TokenType[])
            expect(result).toEqual([])
        })
    })

    describe('setValueToTokenRanges', () => {
        test('default', () => {
            const result = hclTokenizer.setValueToTokenRanges(undefined, "comment.hcl", null as any)
            expect(result).toEqual(undefined)
        })
    })
})