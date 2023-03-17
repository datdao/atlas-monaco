import CodeCompletion from "../../autocompletion"
import { Dialect } from "../../dialect"
import { sql } from "./testdata/hcltmpl"
import { textModel } from "./testdata/model"

describe('autocompletion', () => {
    test('buildResourceTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildResourceTemplate("table")).toEqual({
            label: "table",
			kind: 0,
			detail: "",
			insertText: "table" + ' "${1}" {\n\t${0}\n}',
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildReferenceTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildReferenceTemplate("table")).toEqual({
            label: "table",
			kind: 0,
			insertText: "table",
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildAttrDefaultTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildAttrDefaultTemplate("table")).toEqual({
            label: "table",
			kind: 4,
            insertText: 'table = ',
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildAttrValueTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildAttrValueTemplate("type", "int")).toEqual({
            label: "type",
			kind: 4,
            insertText: 'type = int\n${0}',
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildValueTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildValueTemplate("int")).toEqual({
            label: "int",
			kind: 4,
            insertText: "int" + '\n${0}',
			insertTextRules: 4,
			range: null,
        })
    })

    describe('isValidScope', () => {
        test('default', () => {
            const codeConpletion = new CodeCompletion(Dialect.sqlite)
    
            expect(codeConpletion.isValidScope()).toEqual(true)
        })
    
        test('invalid length', () => {
            const codeConpletion = new CodeCompletion(Dialect.sqlite)
    
            expect(codeConpletion.isValidScope([], ["table"])).toEqual(false)
        })

        test('invalid scope at second element', () => {
            const codeConpletion = new CodeCompletion(Dialect.sqlite)
    
            expect(codeConpletion.isValidScope(["table", "columns"], ["table"])).toEqual(false)
        })
    })

    describe('buildGlobalSearchCompletionItems', () => {
        test('default', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite)
            const completionItems = codeCompletion.buildGlobalSearchItems()(["users"])

            const result : any = []
            for (const completionItem of completionItems) {
                result.push(completionItem())
            }
            expect(result).toEqual([codeCompletion.buildReferenceTemplate("users")])
        })

        test('with 2 values', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite)
            const completionItems = codeCompletion.buildGlobalSearchItems()(["users", "orders"])

            const result : any = []
            for (const completionItem of completionItems) {
                result.push(completionItem())
            }
            expect(result).toEqual([
                codeCompletion.buildReferenceTemplate("users"),
                codeCompletion.buildReferenceTemplate("orders")
            ])
        })
    })


    describe('buildCompletionItems', () => {
        test('default', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, [])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildResourceTemplate("schema"),
                codeCompletion.buildResourceTemplate("table")])
        })

        test('lvl1 suggestion', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, ["table"])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildResourceTemplate("index"),
                codeCompletion.buildResourceTemplate("column")])
        })

        test('lvl2 suggestion', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any,["table", "column"])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildAttrValueTemplate("comment", "\"${0}\""),
                codeCompletion.buildAttrDefaultTemplate("type"),
            ])
        })

        test('lvl2 value suggestion', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, ["table", "column", "type"])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildValueTemplate("bit"),
                codeCompletion.buildValueTemplate("binary")])
        })
    })

    describe('items', () => {
        test('suggestion at root position', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 1,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 1,
                startColumn: 1,
                startLineNumber : 1,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 0, triggerCharacter: ""} as any, null as any)
            expect(result).toEqual({
                suggestions: [
                    codeCompletion.buildResourceTemplate("schema", range),
                    codeCompletion.buildResourceTemplate("table", range)
                ]  
            } 
            )
        })

        test('suggestion at lvl1 position', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 4,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 4,
                startColumn: 1,
                startLineNumber : 4,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 0, triggerCharacter: ""} as any, null as any)
            expect(result).toEqual({
                suggestions: [
                    codeCompletion.buildResourceTemplate("index", range),
                    codeCompletion.buildResourceTemplate("column", range)
                    
                ]  
            } 
            )
        })

        test('suggestion at lvl2 position', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 30,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 30,
                startColumn: 1,
                startLineNumber : 30,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 0, triggerCharacter: ""} as any, null as any)
            expect(result).toEqual({
                suggestions: [
                    codeCompletion.buildAttrValueTemplate("comment", "\"${0}\"", range),
                    codeCompletion.buildAttrDefaultTemplate("type", range)
                ]  
            } 
            )
        })

        test('suggestion at lvl2 position v2', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 35,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 35,
                startColumn: 1,
                startLineNumber : 35,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 0, triggerCharacter: ""} as any, null as any)
            expect(result).toEqual({
                suggestions: [
                    codeCompletion.buildAttrValueTemplate("comment", "\"${0}\"", range),
                    codeCompletion.buildAttrValueTemplate("columns", "[${0}]", range),
                    codeCompletion.buildAttrDefaultTemplate("unique", range),
                    codeCompletion.buildResourceTemplate("on", range, {allowNullName: true})
                ]  
            } 
            )
        })

        test('suggestion at lvl1 position with value', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 5,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 5,
                startColumn: 1,
                startLineNumber : 5,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 0, triggerCharacter: ""} as any, null as any)
            expect(result).toEqual({
                suggestions: [
                    codeCompletion.buildValueTemplate("bit", range),
                    codeCompletion.buildValueTemplate("binary", range)
                ]  
            } 
            )
        })

        test('absolute path', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 22,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 22,
                startColumn: 1,
                startLineNumber : 22,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 1, triggerCharacter: "."} as any, null as any)
            expect(result).toEqual({
                suggestions: [
                    codeCompletion.buildReferenceTemplate("id", range)
                ]  
            } 
            )
        })

        test('relative path', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.getProvider()

            const position: any = {
                lineNumber: 21,
            }

            const range: any = {
                endColumn: 1,
                endLineNumber: 21,
                startColumn: 1,
                startLineNumber : 21,
            }

            const result = completionProvider.provideCompletionItems(
                textModel as any, position, {triggerKind: 1, triggerCharacter: "."} as any, null as any)
            expect(result).toEqual({
                    suggestions: [
                        codeCompletion.buildReferenceTemplate("owner_id", range)
                    ]  
                } 
            )
        })
    })

})