export const sql = {
    sql: {
        schema: {
            charset: "\"${0}\"",
        },

        table: {
            index: {
                comment: "\"${0}\"",
                columns: "[${0}]",
                unique: ["true","false"],
                on: {
                    column: "\"${0}\"",
                }
            },
            column: {
                comment: "\"${0}\"",
                type: [
                    "bit",
                    "binary",
                ]
            }
        }
    },
}