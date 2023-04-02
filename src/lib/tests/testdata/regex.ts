const hclResourceLine = {
  default: `table "users" {`,
  haveBracketInValue: `table "{}" {`,
  uncomplete: `table "users"`,
  uncompleteAndHaveBracketInValue: `table "{}"`,
  multivalues: `table "users" "users2" {`,
};

const hclAttrLine = {
  default: `type = integer`,
  defaultWithManySpace: `type   =   integer`,
  uncomplete: `type`,
};

const hclPath = {
  default: `table.`,
  multiPath: `table.users.`,
  uncomplete: `table.users`,
  endWithEnclosedCharacter: `table.users.]`,
};

const hclRawPath = {
  default: `table.`,
  array: "[table.users, column.users.dw , column.",
  arrayWithEndClosedCharacter: "[table.users, column.users.dw , column.]",
  withoutDotAtEnd: "[table.users, column.users , column.users.test",
};

export { hclResourceLine, hclAttrLine, hclPath, hclRawPath };
