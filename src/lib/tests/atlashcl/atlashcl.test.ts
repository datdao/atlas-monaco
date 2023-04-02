import AtlasHCL from "../../atlashcl"
import CodeCompletion from "../../atlashcl/codecompletion"
import { HCLNavigator } from "../../atlashcl/hcl/navigator"
import { schema, schemaConfig } from "../testdata/hcltmpl"

const hclNavigator = new HCLNavigator(schema.sqlite, schemaConfig)
const codeCompletion = new CodeCompletion(hclNavigator)

const codeCompletionMock = {
    getProvider: jest.fn(()=>{
        return {
            triggerCharacters: ["."],
            provideCompletionItems: jest.fn(),
            resolveCompletionItem: jest.fn()
        }
    })
}

describe('atlashcl', () => {
    test('getLanguageConf', () => {
        const atlashcl = new AtlasHCL(codeCompletion)
        const result =  atlashcl.getLanguageConf()

        expect(result).toBeUndefined()
    })

    test('getLanguageName', () => {
        const atlashcl = new AtlasHCL(codeCompletion)
        const result =  atlashcl.getLanguageName()

        expect(result).toEqual("atlashcl")
    })

    test('getLanguageExt', () => {
        const atlashcl = new AtlasHCL(codeCompletion)
        const result =  atlashcl.getLanguageExt()

        expect(result).toEqual([".hcl"])
    })

    test('getTokenProvider', () => {
        const atlashcl = new AtlasHCL(codeCompletion)
        const result =  atlashcl.getTokenProvider()

        expect(result).toBeUndefined()
    })

    test('new atlas with custom code completion', () => {
        const atlashcl = new AtlasHCL(codeCompletionMock)
        atlashcl.getCodeCompletionProvider()
        expect(codeCompletionMock.getProvider).toBeCalled()
    })
})