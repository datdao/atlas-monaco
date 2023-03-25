import { SuggestionType } from "../../../atlashcl/hcl"
import { HCLNavigator } from "../../../atlashcl/hclnavigator"
import { schema, schemaConfig } from "../../testdata/hcltmpl"

const hclNavigator = new HCLNavigator(schema.sqlite, schemaConfig)

describe('hclnavigator', () => {
    test('default', () => {
        const suggestions = hclNavigator.listSuggestionByNestedScopes([])
        expect(suggestions).toEqual([
            {
                type: SuggestionType.block,
                value: "schema",
                aliases: undefined,
                config: null,
                desc: undefined
            }, 
            {
                type: SuggestionType.block,
                value: "table",
                aliases: undefined,
                config: null,
                desc: undefined
            },
        ])
    })

    test('block type', () => {
        const suggestions = hclNavigator.listSuggestionByNestedScopes(["table"])
        expect(suggestions).toEqual([
            {
                type: SuggestionType.block,
                value: "index",
                aliases: undefined,
                config: null,
                desc: undefined
            }, 
            {
                type: SuggestionType.block,
                value: "column",
                aliases: undefined,
                config: null,
                desc: undefined
            },
        ])
    })

    test('block type with config', () => {
        const suggestions = hclNavigator.listSuggestionByNestedScopes(["table", "index"])
        expect(suggestions).toContainEqual({
            type: SuggestionType.block,
            value: "on",
            aliases: undefined,
            config: {
                allowNullName: true
            },
            desc: undefined
        })
    })

    test('attribute type', () => {
        const suggestions = hclNavigator.listSuggestionByNestedScopes(["schema"])
        expect(suggestions).toEqual([
            {
                type: SuggestionType.attribute,
                value: "charset",
                aliases: undefined,
                config: null,
                desc: undefined
            },
        ])
    })

    test('attribute value', () => {
        const suggestions = hclNavigator.listSuggestionByNestedScopes(["schema", "charset"])
        expect(suggestions).toEqual([
            {
                type: SuggestionType.attributeValue,
                value: "\"${?}\"",
                aliases: undefined,
                config: null,
                desc: undefined
            },
        ])
    })
})