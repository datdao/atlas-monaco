export const schema = {
  sqlite: {
    schema: {
      charset: '"${?}"',
    },

    table: {
      index: {
        comment: '"${?}"',
        columns: "[${?}]",
        unique: ["true", "false"],
        on: {
          column: '"${?}"',
        },
      },
      column: {
        comment: '"${?}"',
        type: ["bit", "binary"],
      },
    },
  },
};

export const schemaConfig = {
  "table.index.on": {
    allowNullName: true,
  },
};
