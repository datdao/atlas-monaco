import { dataType } from '../../data/sql';

describe('sql', () => {
    test('array datatype', () => {
        let result = dataType.func("numberic", [dataType.number, dataType.number])
        expect(result).toEqual("numberic(${?}, ${?})")
    })

    test('array datatype empty', () => {
        let result = dataType.func("numberic")
        expect(result).toEqual("numberic()")
    })
})