
// 'name ${?} $(?) $(?) ${?}' => name ${3} $(2) $(1) ${0}
export function decrementingCursorPosition(text : any) {
    let count = text.split('?').length - 2;
    return text.replace(/\?/g, () => count--);
}