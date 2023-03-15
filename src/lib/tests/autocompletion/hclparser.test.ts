import HclParser, * as hclParser from '../../autocompletion/hclparser';
import * as regexdata from './testdata/regex';
import * as modeldata from './testdata/model';
import * as monaco from 'monaco-editor';
import { parse } from '@babel/core';


it('Runs without crashing', () => {});

describe('regex', () => {
    describe('resourceType', () => {
        test('default', () => {
            const result = regexdata.hclResourceLine.default.match(hclParser.HCL_REGEX.resourceType);
            expect(Array.from(result as RegExpMatchArray)).toEqual(["table \"users\" {","table"]);
        });

        test('hclAttrLine.default', () => {
            const result = regexdata.hclAttrLine.default.match(hclParser.HCL_REGEX.resourceType);
            expect(result).toBe(null);
        });

        test('haveBracketInValue', () => {
            const result = regexdata.hclResourceLine.haveBracketInValue.match(hclParser.HCL_REGEX.resourceType);
            expect(Array.from(result as RegExpMatchArray)).toEqual(["table \"{}\" {","table"]);
        });

        test('uncomplete', () => {
            const result = regexdata.hclResourceLine.uncomplete.match(hclParser.HCL_REGEX.resourceType);
            expect(result).toBe(null);
        });

        test('uncompleteAndHaveBracketInValue', () => {
            const result = regexdata.hclResourceLine.uncompleteAndHaveBracketInValue.match(hclParser.HCL_REGEX.resourceType);
            expect(result).toBe(null);
        });
    })

    describe('resourceValue', () => {
        test('default', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.resourceValue.exec(regexdata.hclResourceLine.default)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["users"]);
        });

        test('multivalues', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.resourceValue.exec(regexdata.hclResourceLine.multivalues)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["users", "users2"]);
        });
    })

    describe('attributeType', () => {
        test('default', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.attributeType.exec(regexdata.hclAttrLine.default)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["type"]);
        });

        test('defaultWithManySpace', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.attributeType.exec(regexdata.hclAttrLine.defaultWithManySpace)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["type"]);
        });

        test('uncomplete', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.attributeType.exec(regexdata.hclAttrLine.uncomplete)) !== null) {
                values.push(match[1])
            }

            expect(null).toBe(null);
        });
    })

    describe('path', () => {
        test('default', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.path.exec(regexdata.hclPath.default)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["table"]);
        });

        test('multiPath', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.path.exec(regexdata.hclPath.multiPath)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["table", "users"]);
        });

        test('uncomplete', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.path.exec(regexdata.hclPath.uncomplete)) !== null) {
                values.push(match[1])
            }

            expect(null).toBe(null);
        });

        test('endWithEnclosedCharacter', () => {
            let match;
            let values : string[] = [];
            while ((match = hclParser.HCL_REGEX.path.exec(regexdata.hclPath.endWithEnclosedCharacter)) !== null) {
                values.push(match[1])
            }

            expect(values).toEqual(["table", "users"]);
        });
    })
});


describe('parser', () => {
    describe('getWordRange', () => {
        test('default', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)
            let range = parser.getWordRange()

            expect(range).toEqual({
                startLineNumber: undefined,
                endLineNumber: undefined,
                startColumn: 1,
                endColumn: 1,
            })
        })

    })

    describe('findResourceAtLineNumber', () => {
        test('resourceLine', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 2} as any)
            let result = parser.findResourceAtLineNumber(2)

            expect(result).toEqual({
                resource: "table",
                values: ["users"],
                lineNumber: 2
            })
        })

        test('resourceLineMultiValues', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 12} as any)
            let result = parser.findResourceAtLineNumber(12)

            expect(result).toEqual({
                resource: "table",
                values: ["orders", "orders2"],
                lineNumber: 12
            })
        })

        test('attrLine', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)
            let result = parser.findResourceAtLineNumber(5)

            expect(result).toBeUndefined()
        })

        test('resourceLineEmptyValue', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 7} as any)
            let result = parser.findResourceAtLineNumber(7)

            expect(result).toEqual({
                resource: "primary_key",
                values: [],
                lineNumber: 7
            })
        })
    })

    describe('findParentBracket', () => {
        test('default', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 4} as any, 1, hclParser.Direction.up)

            expect(result).toEqual(2)
        })

        test('position at root', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 2} as any, 1, hclParser.Direction.up)

            expect(result).toBeUndefined()
        })

        test('position at lvl2', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 8} as any, 1, hclParser.Direction.up)
            expect(result).toEqual(7)
        })

        test('position at lvl2 and find bracket at lvl1', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 7} as any, 2, hclParser.Direction.up)
            expect(result).toBeUndefined()
        })

        test('position at lvl1 with Direction down ', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 3} as any, 1, hclParser.Direction.down)
            expect(result).toEqual(10)
        })

        test('position at lvl2 with Direction down ', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 5} as any, 1, hclParser.Direction.down)
            expect(result).toEqual(6)
        })

        test('position at lvl3 with Direction down ', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket(hclParser.PairCurlyBracket, {lineNumber: 16} as any, 1, hclParser.Direction.down)
            expect(result).toEqual(18)
        })

        test('default params', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.findParentBracket()
            expect(result).toEqual(undefined)
        })
    })

    describe('parentResource', () => {
        test('position at level1', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.parentResource({lineNumber: 3} as any)
            expect(result).toEqual({
                resource: "table",
                values: ["users"],
                lineNumber: 2
            })
        })

        test('position at level2', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.parentResource({lineNumber: 5} as any)
            expect(result).toEqual({
                resource: "column",
                values: ["id"],
                lineNumber: 4
            })
        })

        test('position at level3 with null value', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)

            let result = parser.parentResource({lineNumber: 8} as any)
            expect(result).toEqual({
                resource: "primary_key",
                values: [],
                lineNumber: 7
            })
        })
    })

    describe('parentResources', () => {
        test('position at level1', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 3} as any)

            let result = parser.parentResources()
            expect(result).toEqual([
                {
                    resource: "table",
                    values: ["users"],
                    lineNumber: 2
                }
            ])
        })

        test('position at level2', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)

            let result = parser.parentResources()
            expect(result).toEqual([
                {
                    resource: "table",
                    values: ["users"],
                    lineNumber: 2
                },
                {
                    resource: "column",
                    values: ["id"],
                    lineNumber: 4
                }
            ])
        })

        test('position at level3 with null value', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 8} as any)

            let result = parser.parentResources()
            expect(result).toEqual([
                {
                    resource: "table",
                    values: ["users"],
                    lineNumber: 2
                },
                {
                    resource: "primary_key",
                    values: [],
                    lineNumber: 7
                }
            ])
        })
    })

    describe('listBlockScope', () => {
        test('position at block level 1', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 2} as any)

            let result = parser.listBlockScope()
            expect(result).toEqual([])
        })

        test('position at block lvl2', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 3} as any)

            let result = parser.listBlockScope()
            expect(result).toEqual(["table","schema"])
        })

        test('position at block lvl3', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)

            let result = parser.listBlockScope()
            expect(result).toEqual(["table", "column", "type"])
        })
    })

    describe('parseCurrentWordToPath', () => {
        test('default', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 3} as any)

            let result = parser.parseCurrentWordToPath()
            expect(result).toEqual(["schema"])
        })

        test('absolutepath', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 22} as any)

            let result = parser.parseCurrentWordToPath()
            expect(result).toEqual(["table","users","column"])
        })

        test('relativepath', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 21} as any)

            let result = parser.parseCurrentWordToPath()
            expect(result).toEqual(["column"])
        })
    })

    describe('fillMissingPath', () => {
        test('default', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 3} as any)

            let result = parser.fillMissingPath(["schema"])
            expect(result).toEqual([])
        })

        test('absolutepath', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 22} as any)

            let result = parser.fillMissingPath(["table","users","column"])
            expect(result).toEqual(["table","users","column"])
        })

        test('relativepath', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 21} as any)

            let result = parser.fillMissingPath(["column"])
            expect(result).toEqual(["table","orders","column"])
        })
    })

    describe('compareRange', () => {
        test('inner', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)
            const result = parser.compareRange({
                startLineNumber:1,
                endLineNumber: 10
            } as any,{
                startLineNumber:2,
                endLineNumber: 9
            } as any)

            expect(result).toEqual(1)
        })

        test('outer', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)
            
            const result = parser.compareRange({
                startLineNumber:2,
                endLineNumber: 9
            } as any,{
                startLineNumber:1,
                endLineNumber: 10
            } as any)

            expect(result).toEqual(2)
        })

        test('undefined', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                modeldata.position as any)
            const result = parser.compareRange({
                startLineNumber:2,
                endLineNumber: 11
            } as any,{
                startLineNumber:1,
                endLineNumber: 10
            } as any)

            expect(result).toEqual(0)
        })
    })

    describe('findReferencedResourceValues', () => {
        test('absolute path', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 1} as any)
            const result = parser.findReferencedResourceValues(["table"])

            expect(result).toEqual([
                "users", "orders", "orders2", "customers"
            ])
        })

        test('absolute path lvl2', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 1} as any)
            const result = parser.findReferencedResourceValues(["table","users","column"])

            expect(result).toEqual([
                "id"
            ])
        })

        test('relative path lvl2 ', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 5} as any)
            const result = parser.findReferencedResourceValues(["column"])

            expect(result).toEqual(["id"])
        })

        test('relative path lvl3', () => {
            let parser = new HclParser(
                modeldata.textModel as any,
                {lineNumber: 8} as any)
            const result = parser.findReferencedResourceValues(["column"])

            expect(result).toEqual(["id"])
        })
    })

    describe('recursive test', () => {
        test('findParentBracket', () => {
            let lines = modeldata.content.split("\n");
            for(let line = 0; line < modeldata.textModel.getLineCount(); line++) {
                
                for(let column = 0; column < lines[line].length ; column++) {
                    let parser = new HclParser(
                        modeldata.textModel as any,
                        {lineNumber: line, column: column} as any)
                    parser.findParentBracket(
                        hclParser.PairCurlyBracket,
                        getRandomElement([0,1,2,3,4,5]),
                        getRandomElement([null as any, {lineNumber: line, column: column} as any]),
                        getRandomElement([hclParser.Direction.up,hclParser.Direction.down]))
                    
                }
            }

            expect(true).toEqual(true)
        })

        test('parentResources', () => {
            let lines = modeldata.content.split("\n");
            for(let line = 0; line < modeldata.textModel.getLineCount(); line++) {
                
                for(let column = 0; column < lines[line].length ; column++) {
                    let parser = new HclParser(
                        modeldata.textModel as any,
                        {lineNumber: line, column: column} as any)
                    parser.parentResources()
                    
                }
            }

            expect(true).toEqual(true)
        })

        test('findReferencedResourceValues', () => {
            let lines = modeldata.content.split("\n");
            for(let line = 0; line < modeldata.textModel.getLineCount(); line++) {
                
                for(let column = 0; column < lines[line].length ; column++) {
                    let parser = new HclParser(
                        modeldata.textModel as any,
                        {lineNumber: line, column: column} as any)
                    parser.findReferencedResourceValues(getRandomElement([[""], ["table"], ["column", "users"], [0,1,2], [null]]))
                    
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
