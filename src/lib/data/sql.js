export const sql = {
    "mysql": {
        "schema": {
            "charset": "",
            "collate": "",
            "comment": ""
        },

        "table": {
            "schema": "",
            "charset": "",
            "collate": "",
            "comment": "",
            "primary_key": {
                "columns": "[${0}]"
            },
            "index": {
                "comment": "",
                "type": [
                    "BTREE",
                    "HASH",
                    "FULLTEXT",
                    "SPATIAL"
                ],
                "columns": "[${0}]",
                "unique": ["true","false"],
                "on": {
                    "column": "",
                    "desc": "true",
                    "where": "",
                    "prefix": ""
                }
            },
            "foreign_key": {
                "columns": "[${0}]",
                "ref_columns": "[${0}]",
                "on_delete": [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ],
                "on_update": [
                    "NO_ACTION",
                    "RESTRICT",
                    "CASCADE",
                    "SET_NULL",
                    "DEFAULT"
                ]
            },
            "column": {
                "auto_increment": ["true","false"],
                "comment": "",
                "type": [
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
    }
}