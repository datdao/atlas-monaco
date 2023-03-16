import { decrementingCursorPosition } from "../../autocompletion/util";

describe('util', () => {
    test('decrementingCursorPosition', () => {
        let text = "name ${?} $(?) $(?) ${?}"

        expect(decrementingCursorPosition(text)).toEqual("name ${3} $(2) $(1) ${0}")
    })
})