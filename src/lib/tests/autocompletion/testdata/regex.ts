const hclResourceLine = {
    default: `table "users" {`,
    haveBracketInValue: `table "{}" {`,
    uncomplete: `table "users"`,
    uncompleteAndHaveBracketInValue: `table "{}"`,
    multivalues: `table "users" "users2" {`,
}


const hclAttrLine = {
    default: `type = integer`,
    defaultWithManySpace: `type   =   integer`,
    uncomplete: `type`

}

const hclPath = {
    default: `table.`,
    multiPath: `table.users.`,
    uncomplete: `table.users`,
    endWithEnclosedCharacter: `table.users.]`
}

export { 
    hclResourceLine,
    hclAttrLine,
    hclPath
};
