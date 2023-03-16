import AtlasHcl from "../atlashcl"
import { defaultConfig } from "../config"
import { Dialect } from "../dialect"

const codeCompletionMock = {
    items: jest.fn(()=>{
        return {
            triggerCharacters: ["."],
            provideCompletionItems: jest.fn(),
            resolveCompletionItem: jest.fn()
        }
    })
}

describe('atlashcl', () => {
    test('getLanguageConf', () => {
        const atlashcl = new AtlasHcl()
        const result =  atlashcl.getLanguageConf()

        expect(result).toBeUndefined()
    })

    test('getLanguageName', () => {
        const atlashcl = new AtlasHcl()
        const result =  atlashcl.getLanguageName()

        expect(result).toEqual("atlashcl")
    })

    test('getLanguageExt', () => {
        const atlashcl = new AtlasHcl()
        const result =  atlashcl.getLanguageExt()

        expect(result).toEqual([".hcl"])
    })

    test('getTokenProvider', () => {
        const atlashcl = new AtlasHcl()
        const result =  atlashcl.getTokenProvider()

        expect(result).toBeUndefined()
    })

    test('new atlas with custom code completion', () => {
        const atlashcl = new AtlasHcl(Dialect.sql, defaultConfig as any, codeCompletionMock)
        atlashcl.getCompletionProvider()
        expect(codeCompletionMock.items).toBeCalled
    })
})