import { HCLNavigator } from "../../../atlashcl/hcl/navigator";
import { HCLTokenizer } from "../../../atlashcl/hcl/tokenizer";
import Linter from "../../../atlashcl/linter";
import { errors } from "../../../atlashcl/linter/errors";

import { schema, schemaConfig } from "../../testdata/hcltmpl"
import { emptyTextModel, textModel, monaco } from "../../testdata/model";

const hclNavigator = new HCLNavigator(schema.sqlite, schemaConfig)
const hclTokenizer = new HCLTokenizer(monaco as any)
const linter = new Linter(hclNavigator, hclTokenizer)

it('Runs without crashing', () => {});

describe('linter', () => {
    describe('nonComplaintWord', () => {
        test('default', () => {
            const position = {
                lineNumber: 3,
                column: 27
            }
    
            const range: any = {
                endColumn: 31,
                endLineNumber: 3,
                startColumn: 25,
                startLineNumber : 3,
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(linter.buildWarningMarker(range, errors.nonCompliantAttr("table", "schema")))
        })

        test('position at block type that exist in template', () => {
            const position = {
                lineNumber: 4,
                column: 28
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(undefined)
        })

        test('at spacing', () => {
            const position = {
                lineNumber: 2,
                column: 9
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(undefined)
        })

        test('in square braket', () => {
            const position = {
                lineNumber: 14,
                column: 43
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(undefined)
        })

        test('at attribute value postition that is not existed in template', () => {
            const position = {
                lineNumber: 30,
                column: 38
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(undefined)
        })

        test('at attribute value postion that is not existed in template', () => {
            const position = {
                lineNumber: 5,
                column: 39
            }

            const range: any = {
                endColumn: 43,
                endLineNumber: 5,
                startColumn: 36,
                startLineNumber : 5,
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(linter.buildWarningMarker(range, errors.nonCompliantValue("type", "integer")))
        })

        test('at attribute value postion that is default value', () => {
            const position = {
                lineNumber: 31,
                column: 39
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(undefined)
        })

        test('at root block position', () => {
            const position = {
                lineNumber: 40,
                column: 21
            }
    
            const decoration = linter.validateNonCompliantWord(textModel as any, position as any)
            expect(decoration).toEqual(linter.buildWarningMarker(
                {"endColumn": 24, "endLineNumber": 40, "startColumn": 21, "startLineNumber": 40},
                errors.nonCompliantResource("var")))
        })
        
    })

    describe('nonComplaintWordAll', () => {
        test('default', () => {
            const decorations = linter.validateNonCompliantWordAll(textModel as any)
            expect(decorations.length).toEqual(33)
        })

        test('return empty array', () => {
            const decorations = linter.validateNonCompliantWordAll(emptyTextModel as any)
            expect(decorations).toEqual([])
        })
    })

    describe('nonComplaintWordLine', () => {
        test('default', () => {
            const range: any = {
                endColumn: 43,
                endLineNumber: 5,
                startColumn: 36,
                startLineNumber : 5,
            }
    
            const decorations = linter.validateNonCompliantWordLine(textModel as any, 5)
            expect(decorations).toEqual([linter.buildWarningMarker(range, errors.nonCompliantValue("type", "integer"))])
        })

        test('empty line', () => {    
            const decorations = linter.validateNonCompliantWordLine(textModel as any, 11)
            expect(decorations).toEqual([])
        })
    })
    
})