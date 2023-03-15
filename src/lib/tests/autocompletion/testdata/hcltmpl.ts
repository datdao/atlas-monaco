export const sql = {
    sql: {
        schema: {
            charset: "",
        },

        table: {
            index: {
                comment: "",
                columns: "[${0}]",
                unique: ["true","false"],
                on: {
                    column: "",
                }
            },
            column: {
                comment: "",
                type: [
                    "bit",
                    "binary",
                ]
            }
        }
    },
}