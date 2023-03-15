import { getDialectKeyPair } from "../dialect"

describe('dialect', () => {
    test('getDialectKeyPair', () => {
        let result = getDialectKeyPair()
        expect(result).toEqual({
            sql: "sql",
            mysql: "mysql",
            postgresql: "postgresql"
        })
    })
})