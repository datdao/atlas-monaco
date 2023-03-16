/* eslint-disable no-unused-vars */
 export enum Dialect {
    sql = "sql",
    mysql = "mysql",
    postgresql = "postgresql"
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getDialectKeyPair() : Object {
    return Object(Dialect)
}