 export enum Dialect {
    sql = "sql",
    mysql = "mysql",
    postgresql = "postgresql"
}

export function getDialectKeyPair() : Object {
    return Object(Dialect)
}