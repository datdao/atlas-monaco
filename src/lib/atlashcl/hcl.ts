export enum SuggestionType {
    // eslint-disable-next-line no-unused-vars
    block = "block",
    // eslint-disable-next-line no-unused-vars
    attribute = "attribute",
    // eslint-disable-next-line no-unused-vars
    attributeValue = "attribute_value",
}

export type Suggestion = {
    type : SuggestionType
    value : string,
    aliases? : string[]
    desc?: string
    config? : any
}

export type Block = {
    type : string
    blocks: string[]
    references: string[]

    attrs: Attribute[]
}

export type Attribute = {
    type : string
    values: string
}