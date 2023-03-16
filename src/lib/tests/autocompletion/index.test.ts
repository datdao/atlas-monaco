import CodeCompletion from "../../autocompletion"
import { Dialect } from "../../dialect"
import { sql } from "./testdata/hcltmpl"
import { textModel } from "./testdata/model"

describe('autocompletion', () => {
    test('buildResourceCompletionTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildResourceCompletionTemplate(null as any, "table")).toEqual({
            label: "table",
			kind: 0,
			detail: "",
			insertText: "table" + ' "${1}" {\n\t${0}\n}',
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildReferenceCompletionTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildReferenceCompletionTemplate(null as any, "table")).toEqual({
            label: "table",
			kind: 0,
			insertText: "table",
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildAttrDefaultCompletionTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildAttrDefaultCompletionTemplate(null as any, "table")).toEqual({
            label: "table",
			kind: 4,
            insertText: 'table = ',
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildAttrValueCompletionTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildAttrValueCompletionTemplate(null as any, "type", "int")).toEqual({
            label: "type",
			kind: 4,
            insertText: 'type = int\n${0}',
			insertTextRules: 4,
			range: null,
        })
    })

    test('buildValueCompletionTemplate', () => {
        const codeConpletion = new CodeCompletion(Dialect.sqlite)

        expect(codeConpletion.buildValueCompletionTemplate(null as any, "int")).toEqual({
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
            const completionItems = codeCompletion.buildGlobalSearchCompletionItems()(["users"])

            const result : any = []
            for (const completionItem of completionItems) {
                result.push(completionItem())
            }
            expect(result).toEqual([codeCompletion.buildReferenceCompletionTemplate(null as any, "users")])
        })

        test('with 2 values', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite)
            const completionItems = codeCompletion.buildGlobalSearchCompletionItems()(["users", "orders"])

            const result : any = []
            for (const completionItem of completionItems) {
                result.push(completionItem())
            }
            expect(result).toEqual([
                codeCompletion.buildReferenceCompletionTemplate(null as any, "users"),
                codeCompletion.buildReferenceCompletionTemplate(null as any, "orders")
            ])
        })
    })


    describe('buildCompletionItems', () => {
        test('default', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildCompletionItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, [])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildResourceCompletionTemplate(null as any, "schema"),
                codeCompletion.buildResourceCompletionTemplate(null as any, "table")])
        })

        test('lvl1 suggestion', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildCompletionItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, ["table"])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildResourceCompletionTemplate(null as any, "index"),
                codeCompletion.buildResourceCompletionTemplate(null as any, "column")])
        })

        test('lvl2 suggestion', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildCompletionItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, ["table", "column"])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildAttrValueCompletionTemplate(null as any, "comment", "\"${0}\""),
                codeCompletion.buildAttrDefaultCompletionTemplate(null as any, "type"),
            ])
        })

        test('lvl2 value suggestion', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionItems = codeCompletion.buildCompletionItems([], null as any)

            const result : any = []
            for (let completionItem of completionItems) {
                completionItem = completionItem(null as any, ["table", "column", "type"])
                if (completionItem != null) {
                    result.push(completionItem)
                }
                
            }
            expect(result).toEqual([
                codeCompletion.buildValueCompletionTemplate(null as any, "bit"),
                codeCompletion.buildValueCompletionTemplate(null as any, "binary")])
        })
    })

    describe('items', () => {
        test('suggestion at root position', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                    codeCompletion.buildResourceCompletionTemplate(range as any, "schema"),
                    codeCompletion.buildResourceCompletionTemplate(range as any, "table")
                ]  
            } 
            )
        })

        test('suggestion at lvl1 position', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                    codeCompletion.buildResourceCompletionTemplate(range as any, "index"),
                    codeCompletion.buildResourceCompletionTemplate(range as any, "column")
                    
                ]  
            } 
            )
        })

        test('suggestion at lvl2 position', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                    codeCompletion.buildAttrValueCompletionTemplate(range as any, "comment", "\"${0}\""),
                    codeCompletion.buildAttrDefaultCompletionTemplate(range as any, "type")
                ]  
            } 
            )
        })

        test('suggestion at lvl2 position v2', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                    codeCompletion.buildAttrValueCompletionTemplate(range as any, "comment", "\"${0}\""),
                    codeCompletion.buildAttrValueCompletionTemplate(range as any, "columns", "[${0}]"),
                    codeCompletion.buildAttrDefaultCompletionTemplate(range as any, "unique"),
                    codeCompletion.buildResourceCompletionTemplate(range as any, "on", {allowNullName: true})
                ]  
            } 
            )
        })

        test('suggestion at lvl1 position with value', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                    codeCompletion.buildValueCompletionTemplate(range as any, "bit"),
                    codeCompletion.buildValueCompletionTemplate(range as any, "binary")
                ]  
            } 
            )
        })

        test('absolute path', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                    codeCompletion.buildReferenceCompletionTemplate(range as any, "id")
                ]  
            } 
            )
        })

        test('relative path', () => {
            const codeCompletion = new CodeCompletion(Dialect.sqlite, sql)
            const completionProvider = codeCompletion.items()

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
                        codeCompletion.buildReferenceCompletionTemplate(range as any, "owner_id")
                    ]  
                } 
            )
        })
    })

})