import AtlasHcl, { ICodeCompletion } from "../atlashcl"
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
        // let atlashcl = new AtlasHcl()
        // let result =  atlashcl.getLanguageConf()

        // expect(result).toBeUndefined()
    })

    // test('getLanguageName', () => {
    //     let atlashcl = new AtlasHcl()
    //     let result =  atlashcl.getLanguageName()

    //     expect(result).toEqual("atlashcl")
    // })

    // test('getLanguageExt', () => {
    //     let atlashcl = new AtlasHcl()
    //     let result =  atlashcl.getLanguageExt()

    //     expect(result).toEqual([".hcl"])
    // })

    // test('getTokenProvider', () => {
    //     let atlashcl = new AtlasHcl()
    //     let result =  atlashcl.getTokenProvider()

    //     expect(result).toBeUndefined()
    // })

    // test('new atlas with custom code completion', () => {
    //     let atlashcl = new AtlasHcl(Dialect.sql, defaultConfig as any, codeCompletionMock)
    //     const result = atlashcl.getCompletionProvider()
    //     expect(codeCompletionMock.items).toBeCalled()
    // })
})