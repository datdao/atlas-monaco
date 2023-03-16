import { getDialectKeyPair } from "../dialect"

describe('dialect', () => {
    test('getDialectKeyPair', () => {
        const result = getDialectKeyPair()
        expect(result).toEqual({
            sqlite: "sqlite",
            mysql: "mysql",
            postgresql: "postgresql"
        })
    })
})