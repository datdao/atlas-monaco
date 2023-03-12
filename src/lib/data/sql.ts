export const sql = {
    mysql: {
        schema: {
            charset: "",
            collate: "",
            comment: ""
        },

        table: {
            schema: "",
            charset: "",
            collate: "",
            comment: "",
            primary_key: {
                columns: "[${0}]"
            },
            index: {
                comment: "",
                type: [
                    "BTREE",
                    "HASH",
                    "FULLTEXT",
                    "SPATIAL"
                ],
                columns: "[${0}]",
                unique: ["true","false"],
                on: {
                    column: "",
                    desc: "true",
                    where: "",
                    prefix: ""
                }
            },
            foreign_key: {
                columns: "[${0}]",
                ref_columns: "[${0}]",
                on_delete: [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ],
                on_update: [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ]
            },
            column: {
                auto_increment: ["true","false"],
                comment: "",
                type: [
                    "bit",
                    "binary",
                    "blob",
                    "boolean",
                    "time",
                    "timestamp",
                    "date",
                    "datetime",
                    "year",
                    "decimal",
                    "numeric",
                    "float",
                    "double",
                    "enum",
                    "int",
                    "tinyint",
                    "smallint",
                    "mediumint",
                    "bigint",
                    "json",
                    "set",
                    "varchar",
                    "char",
                    "tinytext",
                    "mediumtext",
                    "text",
                    "longtext",
                    "geometry",
                    "point",
                    "multipoint",
                    "linestring"
                ]
            }
        }
    },
    sql: {
        schema: {
            charset: "",
            collate: "",
            comment: ""
        },

        table: {
            schema: "",
            charset: "",
            collate: "",
            comment: "",
            primary_key: {
                columns: "[${0}]"
            },
            index: {
                comment: "",
                type: [
                    "BTREE",
                    "HASH",
                    "FULLTEXT",
                    "SPATIAL"
                ],
                columns: "[${0}]",
                unique: ["true","false"],
                on: {
                    column: "",
                    desc: "true",
                    where: "",
                    prefix: ""
                }
            },
            foreign_key: {
                columns: "[${0}]",
                ref_columns: "[${0}]",
                on_delete: [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ],
                on_update: [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ]
            },
            column: {
                auto_increment: ["true","false"],
                comment: "",
                type: [
                    "blob",
                    "int",
                    "decimal",
                    "text",
                    "real",
                    "bool",
                    "date",
                    "datetime",
                    "uuid",
                    "json"
                ]
            }
        }
    },
    postgresql: {
        schema: {
            comment: "",
        },

        enum: {
            schema: [""],
            values: ["on", "off"]
        },

        table: {
            schema: "",
            comment: "",
           
            primary_key: {
                columns: "[${0}]"
            },
            index: {
                comment: "",
                type: [
                    "BTREE",
                    "HASH",
                    "FULLTEXT",
                    "SPATIAL"
                ],
                columns: "[${0}]",
                unique: ["true","false"],
                on: {
                    column: "",
                    desc: "true",
                    where: "",
                    prefix: ""
                }
            },
            foreign_key: {
                columns: "[${0}]",
                ref_columns: "[${0}]",
                on_delete: [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ],
                on_update: [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ]
            },
            column: {
                auto_increment: ["true","false"],
                collate: "",
                comment: "",
                indentify: {
                    generated: ["ALWAYS"],
                    start: [""],
                    increment: [""]
                },
                type: [
                    "sql(\"${1}\")",
                    "bit",
                    "bit_varying",
                    "bit_varying(${1})",
                    "boolean",
                    "bytea",
                    "date",
                    "time",
                    "timetz",
                    "timestamptz",
                    "timestamp(\"${1:test}\")",
                    "interval",
                    "numberic",
                    "numberic(${1})",
                    "numberic(${2},${3})",
                    "real",
                    "double_precision",
                    "float(${1})",
                    "circle",
                    "line",
                    "lseg",
                    "box",
                    "path",
                    "polygon",
                    "point",
                    "smallint",
                    "integer",
                    "int",
                    "bigint",
                    "json",
                    "jsonb",
                    "money",
                    "inet",
                    "cidr",
                    "macadir",
                    "macaddr8",
                    "int4range",
                    "int8range",
                    "numrange",
                    "tsrange",
                    "tstzrange",
                    "daterange",
                    "int4multirange",
                    "int8multirange",
                    "nummultirange",
                    "tsmultirange",
                    "tstzmultirange",
                    "datemultirange",
                    "smallserial",
                    "serial",
                    "bigserial",
                    "varchar",
                    "varchar(\"${1}\")",
                    "char",
                    "char(\"${1}\")",
                    "text",
                    "tsvector",
                    "tsquery",
                    "uuid",
                    "xml",

                ],
                "default": [""]
            },
            partition: {
                type: ["RANGE"],
                columns: "[${0}]",
                by: {
                    column: [""],
                    expr: "",

                }
            }
        }
    }
}