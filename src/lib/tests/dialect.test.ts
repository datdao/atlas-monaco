import { getDialectKeyPair } from "../dialect"

describe('dialect', () => {
    test('getDialectKeyPair', () => {
        const result = getDialectKeyPair()
        expect(result).toEqual({
            sql: "sql",
            mysql: "mysql",
            postgresql: "postgresql"
        })
    })
})