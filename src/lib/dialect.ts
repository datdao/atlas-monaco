/* eslint-disable no-unused-vars */
 export enum Dialect {
    sqlite = "sqlite",
    mysql = "mysql",
    postgresql = "postgresql"
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getDialectKeyPair() : Object {
    return Object(Dialect)
}