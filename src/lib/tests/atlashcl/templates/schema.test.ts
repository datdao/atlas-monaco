import { dataType } from '../../../atlashcl/templates/schema';

describe('sql', () => {
    test('array datatype', () => {
        const result = dataType.func("numberic", [dataType.number, dataType.number])
        expect(result).toEqual("numberic(${?}, ${?})")
    })

    test('array datatype empty', () => {
        const result = dataType.func("numberic")
        expect(result).toEqual("numberic()")
    })
})