export const errors = {
    nonCompliantAttr: (parentBlock : string, attribute: string) => {
        return `unknown attribute "${attribute}" in "${parentBlock}" resource`
    },
    nonCompliantValue: (attribute : string, value: string) => {
        return `unknown value "${value}" in "${attribute}" attribute`
    },
    nonCompliantResource: (resource : string) => {
        return `unknown resource "${resource}"`
    },
}