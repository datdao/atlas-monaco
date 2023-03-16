export const dataType = {
    bool: ["true", "false"],
    actions: [
        "NO_ACTION",
        "RESTRICT",
        "CASCADE",
        "SET_NULL",
        "DEFAULT"
    ],
    number: "${?}",
    string: "\"${?}\"",
    array: "[${?}]",
    index: [
        "BTREE",
        "HASH",
        "FULLTEXT",
        "SPATIAL"
    ],
    switch: ["on", "off"],
    ref: "${?}",
    func: function(name: string, params : any = []) {
        return name + "(" + params.join(", ") + ")"
    }
}

export const resourceConfig = {
    "table.primary_key": {
        allowNullName: true,
    },
    on: {
        allowNullName: true
    },
    "table.partition": {
        allowNullName: true
    },
    "table.partition.by": {
        allowNullName: true
    },
    "table.column.as": {
        allowNullName: true
    },
    "table.index.on": {
        allowNullName: true
    } 
}

export default {
    mysql: {
        schema: {
            charset: dataType.string,
            collate: dataType.string,
            comment: dataType.string
        },

        table: {
            schema: dataType.string,
            charset: dataType.string,
            collate: dataType.string,
            comment: dataType.string,
            primary_key: {
                type: [
                    "BTREE",
                    "HASH",
                    "FULLTEXT",
                    "SPATIAL"
                ],
                columns: dataType.array
            },
            index: {
                comment: dataType.string,
                type: dataType.index,
                columns: dataType.array,
                unique: dataType.bool,
                on: {
                    column: dataType.string,
                    desc: dataType.bool,
                    where: dataType.string,
                    prefix: dataType.number
                },
            },
            foreign_key: {
                columns: dataType.array,
                ref_columns: dataType.array,
                on_delete: dataType.actions,
                on_update: dataType.actions
            },
            column: {
                as: {
                    type: ["STORED", "PERSISTENT", "VIRTUAL"]
                },
                auto_increment: dataType.bool,
                comment: dataType.string,
                type: [
                    "bool",
                    "boolean",
                    "bit",
                    dataType.func("bit", [dataType.number]),
                    "int",
                    "tinyint",
                    "smaillint",
                    "mediumint",
                    "bitint",
                    "decimal",
                    dataType.func("decimal", [dataType.number]),
                    dataType.func("decimal", [dataType.number, dataType.number]),
                    "numberic",
                    "float",
                    "double",
                    "real",
                    "timestamp",
                    dataType.func("timestamp", [dataType.number]),
                    "date",
                    "time",
                    dataType.func("time", [dataType.number]),
                    "datetime",
                    dataType.func("datetime", [dataType.number]),
                    "year",
                    "varchar",
                    "char",
                    "varbinary",
                    dataType.func("varbinary", [dataType.number]),
                    "binary",
                    dataType.func("binary", [dataType.number]),
                    "blob",
                    "tinyblob",
                    "mediumblocb",
                    "longblob",
                    "json",
                    "text",
                    "tinytext",
                    "mediumtext",
                    "longtext",
                    "geometry",
                    "point",
                    "mutipoint",
                    "linestring",
                    "multipoint",
                    "polygon",
                    "multipolygon",
                    "geometrycollection"
                ],
                on_update: dataType.string,
            },
            check: {
                enforced: dataType.bool,
            },
            auto_increment: dataType.number
        }
    },
    sql: {
        schema: {
            charset: dataType.string,
            collate: dataType.string,
            comment: dataType.string
        },

        table: {
            schema: dataType.string,
            charset: dataType.string,
            collate: dataType.string,
            comment: dataType.string,
            primary_key: {
                columns: dataType.array
            },
            index: {
                comment: dataType.string,
                type: dataType.index,
                columns: dataType.array,
                unique: dataType.bool,
                on: {
                    column: dataType.string,
                    desc: "true",
                    where: dataType.string,
                    prefix: dataType.string
                }
            },
            foreign_key: {
                columns: dataType.array,
                ref_columns: dataType.array,
                on_delete: dataType.actions,
                on_update: dataType.actions
            },
            column: {
                auto_increment: dataType.bool,
                comment: dataType.string,
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
            comment: dataType.string,
        },

        enum: {
            schema: dataType.number,
            values: dataType.switch
        },

        table: {
            schema: dataType.string,
            comment: dataType.string,
           
            primary_key: {
                columns: dataType.array
            },
            index: {
                comment: dataType.string,
                type: [
                    "BTREE",
                    "BRIN",
                    "HASH",
                    "GIN",
                    "GiST",
                    "SPGiST"
                ],
                columns: dataType.array,
                unique: dataType.bool,
                on: {
                    column: dataType.string,
                    desc: dataType.bool,
                    where: dataType.string,
                    prefix: dataType.string
                }
            },
            foreign_key: {
                columns: dataType.array,
                ref_columns: dataType.array,
                on_delete: dataType.actions,
                on_update: dataType.actions
            },
            column: {
                auto_increment: dataType.bool,
                collate: dataType.string,
                comment: dataType.string,
                indentify: {
                    generated: ["ALWAYS", "BY_DEFAULT"],
                    start: dataType.number,
                    increment: dataType.number
                },
                type: [
                    dataType.func("sql", [dataType.string]),
                    "bit",
                    "bit_varying",
                    dataType.func("big_varying", [dataType.number]),
                    "boolean",
                    "bytea",
                    "date",
                    "time",
                    "timetz",
                    "timestamptz",
                    dataType.func("timestamp", [dataType.string]),
                    "interval",
                    "numberic",
                    dataType.func("numberic", [dataType.number]),
                    dataType.func("numberic", [dataType.number, dataType.number]),
                    "real",
                    "double_precision",
                    dataType.func("float", [dataType.number]),
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
                    dataType.func("varchar", [dataType.string]),
                    "char",
                    dataType.func("char", [dataType.string]),
                    "text",
                    "tsvector",
                    "tsquery",
                    "uuid",
                    "xml",
                    "hstore",
                    "sql"
                ],
                "default": dataType.number
            },
            partition: {
                type: ["RANGE", "LIST", "HASH"],
                columns: dataType.array,
                by: {
                    column: dataType.ref,
                    expr: dataType.string,
                }
            }
        }
    }
}