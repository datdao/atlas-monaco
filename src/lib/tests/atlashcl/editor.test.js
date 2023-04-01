import Editor from "../../atlashcl/editor"
import * as mocks from "../testdata/model";
import { HCLNavigator } from "../../atlashcl/hcl/navigator";
import Linter from "../../atlashcl/linter";
import { schema, schemaConfig } from "../testdata/hcltmpl"
import Tokenizer from "../../atlashcl/tokenizer";



// eslint-disable-next-line no-unused-vars
const linterProvider = (langId) => {
    const hclNavigator = new HCLNavigator(schema.sqlite, schemaConfig)
    const tokenizer = new Tokenizer(mocks.monaco)
    const linter = new Linter(hclNavigator, tokenizer)
    return linter
}

const editor  = new Editor(mocks.editor, linterProvider)

// Example test case
beforeEach(() => {
    jest.clearAllMocks();
});

describe('editor', () => {
    test('init', () => {
        const lintAll = jest.spyOn(Editor.prototype, 'lintAll');

        editor.init()

        expect(lintAll).toHaveBeenCalledTimes(2)
        expect(mocks.editor.onDidChangeModelContent).toHaveBeenCalledTimes(1)
        expect(mocks.editor.onDidChangeModelLanguage).toHaveBeenCalledTimes(1)
    })

    test('changeLanguage', () => {
        const clearAllDecorations = jest.spyOn(Editor.prototype, 'clearAllDecorations');
        const lintAll = jest.spyOn(Editor.prototype, 'lintAll');

        editor.changeLanguage("sql")

        expect(clearAllDecorations).toHaveBeenCalledTimes(1)
        expect(lintAll).toHaveBeenCalledTimes(1)
    })

    test('clearAllDecorations', () => {
        editor.clearAllDecorations()
    
        expect(mocks.editor.getModel().getAllDecorations).toHaveBeenCalledTimes(1)
        expect(mocks.editor.getModel().deltaDecorations).toHaveBeenCalledTimes(1)
    })

    describe('clearFollowingDecoration', () => {
        test('default', () => {
            const decoration = {
                range : {
                    startLineNumber : 5,
                    endLineNumber: 6,
                }
            }
    
            const result = editor.clearFollowingDecoration(decoration)
            expect(result).toEqual(true)
            expect(mocks.editor.getModel().deltaDecorations).toHaveBeenCalledTimes(1)
        })
    
        test('same line', () => {
            const decoration = {
                range : {
                    startLineNumber : 6,
                    endLineNumber: 6,
                }
            }
    
            const result = editor.clearFollowingDecoration(decoration)
            expect(result).toEqual(false)
            expect(mocks.editor.getModel().deltaDecorations).toHaveBeenCalledTimes(0)
        })
    })

    describe('clearFollowingDecoration', () => {
        test('default', () => {
            const range = {
                endLineNumber: 1,
            }

            editor.lintTyping(range)
            expect(mocks.editor.getModel().getLineDecorations).toHaveBeenCalledTimes(1)
            expect(mocks.editor.getModel().deltaDecorations).toHaveBeenCalledTimes(2)
        })

        test('owner == 0 && endLineNumber != startLineNumber', () => {
            const range = {
                endLineNumber: 2
            }

            editor.lintTyping(range)
            expect(mocks.editor.getModel().getLineDecorations).toHaveBeenCalledTimes(1)
            expect(mocks.editor.getModel().deltaDecorations).toHaveBeenCalledTimes(2)
        })

        test('owner == 0 && endLineNumber != startLineNumber', () => {
            const range = {
                endLineNumber: 3,
            }

            editor.lintTyping(range)
            expect(mocks.editor.getModel().getLineDecorations).toHaveBeenCalledTimes(1)
            expect(mocks.editor.getModel().deltaDecorations).toHaveBeenCalledTimes(3)
        })
    })
})
