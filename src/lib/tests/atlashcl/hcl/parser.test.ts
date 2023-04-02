import {HCLParser, HCL_REGEX, PairCurlyBracket, Direction} from '../../../atlashcl/hcl/parser';
import { isOverlap } from '../../../atlashcl/utils';
import * as regexdata from '../../testdata/regex';
import * as modeldata from '../../testdata/model';

it('Runs without crashing', () => {});

describe('regex', () => {
    describe('blockType', () => {
        test('default', () => {
            const result = regexdata.hclResourceLine.default.match(HCL_REGEX.blockType);
            expect(Array.from(result as RegExpMatchArray)).toEqual(["table \"users\" {","table"]);
        });

        test('hclAttrLine.default', () => {
            const result = regexdata.hclAttrLine.default.match(HCL_REGEX.blockType);
            expect(result).toBe(null);
        });

        test('haveBracketInValue', () => {
            const result = regexdata.hclResourceLine.haveBracketInValue.match(HCL_REGEX.blockType);
            expect(Array.from(result as RegExpMatchArray)).toEqual(["table \"{}\" {","table"]);
        });

        test('uncomplete', () => {
            const result = regexdata.hclResourceLine.uncomplete.match(HCL_REGEX.blockType);
            expect(result).toBe(null);
        });

        test('uncompleteAndHaveBracketInValue', () => {
            const result = regexdata.hclResourceLine.uncompleteAndHaveBracketInValue.match(HCL_REGEX.blockType);
            expect(result).toBe(null);
        });
    })

    describe('blockValue', () => {
        test('default', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.blockValue.exec(regexdata.hclResourceLine.default)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["users"]);
        });

        test('multivalues', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.blockValue.exec(regexdata.hclResourceLine.multivalues)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["users", "users2"]);
        });
    })

    describe('attributeType', () => {
        test('default', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.attributeType.exec(regexdata.hclAttrLine.default)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["type"]);
        });

        test('defaultWithManySpace', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.attributeType.exec(regexdata.hclAttrLine.defaultWithManySpace)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["type"]);
        });

        test('uncomplete', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.attributeType.exec(regexdata.hclAttrLine.uncomplete)) !== null) {
                values.push(match[1])
            }

            expect(null).toBe(null);
        });
    })

    describe('path', () => {
        test('default', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.path.exec(regexdata.hclPath.default)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["table."]);
        });

        test('multiPath', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.path.exec(regexdata.hclPath.multiPath)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["table.", "users."]);
        });

        test('uncomplete', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.path.exec(regexdata.hclPath.uncomplete)) !== null) {
                values.push(match[0])
            }

            expect(null).toBe(null);
        });

        test('endWithEnclosedCharacter', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.path.exec(regexdata.hclPath.endWithEnclosedCharacter)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["table.", "users."]);
        });
    })

    describe('rawPath', () => {
        test('default', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.rawPath.exec(regexdata.hclRawPath.default)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["table."]);
        });

        test('array', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.rawPath.exec(regexdata.hclRawPath.array)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["column."]);
        });

        test('arrayWithEndClosedCharacter', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.rawPath.exec(regexdata.hclRawPath.arrayWithEndClosedCharacter)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["column.]"]);
        });

        test('withoutDotAtEnd', () => {
            let match;
            const values : string[] = [];
            while ((match = HCL_REGEX.rawPath.exec(regexdata.hclRawPath.withoutDotAtEnd)) !== null) {
                values.push(match[0])
            }

            expect(values).toEqual(["column.users.test"]);
        });
    })
});


describe('parser', () => {
    // describe('getWordRange', () => {
    //     test('default', () => {
    //         const parser = new HCLParser(
    //             modeldata.textModel as any,
    //             modeldata.position as any)
    //         const range = parser.getWordRange()

    //         expect(range).toEqual({
    //             startLineNumber: undefined,
    //             endLineNumber: undefined,
    //             startColumn: 1,
    //             endColumn: 1,
    //         })
    //     })

    // })

    describe('findBlockAtLineNumber', () => {
        test('blockLine', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 2} as any)
            const result = parser.findBlockAtLineNumber(2)

            expect(result).toEqual({
                block: "table",
                values: ["users"],
                lineNumber: 2
            })
        })

        test('blockLineMultiValues', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 12} as any)
            const result = parser.findBlockAtLineNumber(12)

            expect(result).toEqual({
                block: "table",
                values: ["orders", "orders2"],
                lineNumber: 12
            })
        })

        test('attrLine', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)
            const result = parser.findBlockAtLineNumber(5)

            expect(result).toBeUndefined()
        })

        test('blockLineEmptyValue', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 7} as any)
            const result = parser.findBlockAtLineNumber(7)

            expect(result).toEqual({
                block: "primary_key",
                values: [],
                lineNumber: 7
            })
        })
    })

    describe('findParentBracket', () => {
        test('default', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 4, column: 1} as any, 1, Direction.up)

            expect(result).toEqual(2)
        })

        test('position at root', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 2, column: 1} as any, 1, Direction.up)

            expect(result).toBeUndefined()
        })

        test('position at lvl2', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 8} as any, 1, Direction.up)
            expect(result).toEqual(7)
        })

        test('position at lvl2 and find bracket at lvl1', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 7, column: 1} as any, 2, Direction.up)
            expect(result).toBeUndefined()
        })

        test('position at lvl1 with Direction down ', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 3} as any, 1, Direction.down)
            expect(result).toEqual(10)
        })

        test('position at lvl2 with Direction down ', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 5} as any, 1, Direction.down)
            expect(result).toEqual(6)
        })

        test('position at lvl3 with Direction down ', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket(PairCurlyBracket, {lineNumber: 16, column: 43} as any, 1, Direction.down)
            expect(result).toEqual(18)
        })

        test('default params', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBracket()
            expect(result).toEqual(undefined)
        })
    })

    describe('parentResource', () => {
        test('position at level1', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBlock({lineNumber: 3} as any)
            expect(result).toEqual({
                block: "table",
                values: ["users"],
                lineNumber: 2
            })
        })

        test('position at level2', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBlock({lineNumber: 5} as any)
            expect(result).toEqual({
                block: "column",
                values: ["id"],
                lineNumber: 4
            })
        })

        test('position at level3 with null value', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                modeldata.position as any)

            const result = parser.findParentBlock({lineNumber: 8} as any)
            expect(result).toEqual({
                block: "primary_key",
                values: [],
                lineNumber: 7
            })
        })
    })

    describe('parentResources', () => {
        test('position at level1', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 3} as any)

            const result = parser.findParentBlocks()
            expect(result).toEqual([
                {
                    block: "table",
                    values: ["users"],
                    lineNumber: 2
                }
            ])
        })

        test('position at level2', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)

            const result = parser.findParentBlocks()
            expect(result).toEqual([
                {
                    block: "table",
                    values: ["users"],
                    lineNumber: 2
                },
                {
                    block: "column",
                    values: ["id"],
                    lineNumber: 4
                }
            ])
        })

        test('position at level3 with null value', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 8} as any)

            const result = parser.findParentBlocks()
            expect(result).toEqual([
                {
                    block: "table",
                    values: ["users"],
                    lineNumber: 2
                },
                {
                    block: "primary_key",
                    values: [],
                    lineNumber: 7
                }
            ])
        })
    })

    describe('listScopes', () => {
        test('position at block level 1', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 2,
                column: 1} as any)

            const result = parser.listNestedScopes()
            expect(result).toEqual([])
        })

        test('position at block lvl2', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 3, column: 35} as any)

            const result = parser.listNestedScopes()
            expect(result).toEqual(["table","schema"])
        })

        test('position at block lvl3', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)

            const result = parser.listNestedScopes()
            expect(result).toEqual(["table", "column", "type"])
        })
    })

    describe('parseCurrentWordToPath', () => {
        test('default', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 3} as any)

            const result = parser.parseCurrentWordToNestedScopes()
            expect(result).toEqual(["schema"])
        })

        test('absolutepath', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 22} as any)

            const result = parser.parseCurrentWordToNestedScopes()
            expect(result).toEqual(["table","users","column"])
        })

        test('relativepath', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 21} as any)

            const result = parser.parseCurrentWordToNestedScopes()
            expect(result).toEqual(["column"])
        })
    })

    describe('findReferencedResourceValues', () => {
        test('absolute path', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 1} as any)
            const result = parser.findReferencedBlockValues(["table"])

            expect(result).toEqual([
                "users", "orders", "orders2", "customers"
            ])
        })

        test('absolute path lvl2', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 1} as any)
            const result = parser.findReferencedBlockValues(["table","users","column"])

            expect(result).toEqual([
                "id"
            ])
        })

        test('relative path lvl2 ', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)
            const result = parser.findReferencedBlockValues(["column"])

            expect(result).toEqual(["id","owner_id","id"])
        })

        test('relative path lvl3', () => {
            const parser = new HCLParser(
                modeldata.textModel as any,
                {lineNumber: 8} as any)
            const result = parser.findReferencedBlockValues(["column"])

            expect(result).toEqual(["id","owner_id","id"])
        })
    })

    describe('recursive test', () => {
        test('findParentBracket', () => {
            const lines = modeldata.content.split("\n");
            for(let line = 0; line < modeldata.textModel.getLineCount(); line++) {
                
                for(let column = 0; column < lines[line].length ; column++) {
                    const parser = new HCLParser(
                        modeldata.textModel as any,
                        {lineNumber: line, column: column} as any)
                    parser.findParentBracket(
                        PairCurlyBracket,
                        getRandomElement([0,1,2,3,4,5]),
                        getRandomElement([null as any, {lineNumber: line, column: column} as any]),
                        getRandomElement([Direction.up,Direction.down]))
                    
                }
            }

            expect(true).toEqual(true)
        })

        test('parentResources', () => {
            const lines = modeldata.content.split("\n");
            for(let line = 0; line < modeldata.textModel.getLineCount(); line++) {
                
                for(let column = 0; column < lines[line].length ; column++) {
                    const parser = new HCLParser(
                        modeldata.textModel as any,
                        {lineNumber: line, column: column} as any)
                    parser.findParentBlocks()
                    
                }
            }

            expect(true).toEqual(true)
        })

        test('findReferencedResourceValues', () => {
            const lines = modeldata.content.split("\n");
            for(let line = 0; line < modeldata.textModel.getLineCount(); line++) {
                
                for(let column = 0; column < lines[line].length ; column++) {
                    const parser = new HCLParser(
                        modeldata.textModel as any,
                        {lineNumber: line, column: column} as any)
                    parser.findReferencedBlockValues(getRandomElement([[""], ["table"], ["column", "users"], [0,1,2], [null]]))
                    
                }
            }

            expect(true).toEqual(true)
        })
        
    })
})

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export default null
