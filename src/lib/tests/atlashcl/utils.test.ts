import { isOverlap, isPositionInsideRange } from "../../atlashcl/utils"

describe('utils', () => {
    describe('isOverlap', () => {
        test('default', () => {
            const result = isOverlap({
                startLineNumber:1,
                endLineNumber: 10,
                startColumn:1,
                endColumn:9
            } as any,{
                startLineNumber:2,
                endLineNumber: 10,
                startColumn:1,
                endColumn:9
            } as any)
    
            expect(result).toEqual(true)
        })
    
        test('equal', () => {
            const result = isOverlap({
                startLineNumber:2,
                endLineNumber: 9,
                startColumn:1,
                endColumn:9
            } as any,{
                startLineNumber:2,
                endLineNumber: 9,
                startColumn:1,
                endColumn:9
            } as any)
    
            expect(result).toEqual(true)
        })
    
        test('false', () => {
            const result = isOverlap({
                startLineNumber:3,
                endLineNumber: 9,
                startColumn:1,
                endColumn:9
            } as any,{
                startLineNumber:2,
                endLineNumber: 9,
                startColumn:1,
                endColumn:9
            } as any)
    
            expect(result).toEqual(false)
        })
    })

    describe('isPositionInsideRange', () => {
        test('default', () => {
            const position = {
                lineNumber: 1,
                column: 1
            }

            const range = {
                startLineNumber: 0,
                endLineNumber: 2,
                startColumn:0,
                endColumn: 0
            }

            const result = isPositionInsideRange(position, range)
            expect(result).toEqual(true)
        })

        test('cursor at startline but stand after startColumn', () => {
            const position = {
                lineNumber: 1,
                column: 3
            }

            const range = {
                startLineNumber: 1,
                endLineNumber: 2,
                startColumn:1,
                endColumn: 1
            }

            const result = isPositionInsideRange(position, range)
            expect(result).toEqual(true)
        })

        test('cursor at startline but stand before startColumn', () => {
            const position = {
                lineNumber: 1,
                column: 0
            }

            const range = {
                startLineNumber: 1,
                endLineNumber: 2,
                startColumn:1,
                endColumn: 1
            }

            const result = isPositionInsideRange(position, range)
            expect(result).toEqual(false)
        })

        test('cursor at endLine but stand before startColumn', () => {
            const position = {
                lineNumber: 2,
                column: 0
            }

            const range = {
                startLineNumber: 1,
                endLineNumber: 2,
                startColumn:1,
                endColumn: 1
            }

            const result = isPositionInsideRange(position, range)
            expect(result).toEqual(true)
        })

        test('cursor at endLine but stand after startColumn', () => {
            const position = {
                lineNumber: 2,
                column: 3
            }

            const range = {
                startLineNumber: 1,
                endLineNumber: 2,
                startColumn:1,
                endColumn: 1
            }

            const result = isPositionInsideRange(position, range)
            expect(result).toEqual(false)
        })

        test('cursor out of range', () => {
            const position = {
                lineNumber: 5,
                column: 3
            }

            const range = {
                startLineNumber: 1,
                endLineNumber: 2,
                startColumn:1,
                endColumn: 1
            }

            const result = isPositionInsideRange(position, range)
            expect(result).toEqual(false)
        })
    })
})

