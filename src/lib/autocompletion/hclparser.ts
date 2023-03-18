import * as monaco from 'monaco-editor';

export const HCL_REGEX = {
    /*
        table "users" { }  => Match a first word in line "type", 
    */
	resourceType: /(\w+).*(?<!["]){(?!["])/,
    
    /*
        table "users" { }  => Match "users"
    */
	resourceValue: /"(\w+)"/g,

    /*
        type = int  => Match "type"
    */
    attributeType: /^\s*(\w+)\s*=/g,
    
    /*
        table.users.column.id  => Match "table", "users", "column" , reference Path Pattern
    */
	path: /(\w+)\./g,

    /*
        [table.users, column.users , column.users.]  => Match "column.users."
    */
    rawPath: /(\w+\.)+([^\w]|$)/g
}

export const HCL_REGEX_FUNC = {
	bracket: (bracket: Bracket) => {
        return new RegExp(`${bracket.open}|${bracket.close}`, "gm")
    },

    resourceValuebyType: (type: string) => {
        return `${type}(.*)\\{`
    }
}

type Resource = {
    resource: string,
    values: string[],
    lineNumber: number
}

export const enum Direction {
    // eslint-disable-next-line no-unused-vars
    up = "up",
    // eslint-disable-next-line no-unused-vars
    down = "down"
}

export type Bracket = {
    open: string,
    close: string
}

export const PairCurlyBracket : Bracket = {
    open: "{",
    close: "}"
}

class HclParser {
    private textModel: monaco.editor.ITextModel
    private position: monaco.Position

    constructor(textModel: monaco.editor.ITextModel, position: monaco.Position) {
        this.textModel = textModel
        this.position = position
    }

    /*
        Position          Range
            |    ---->      |
            v               v
        Schema         |Schema|
            -
    */
    getWordRange() : monaco.IRange  {
        const word = this.textModel.getWordUntilPosition(this.position);

        return {
            startLineNumber: this.position.lineNumber,
            endLineNumber: this.position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };
    }

    /*
         
         ┌──────────────────────┐
         ▼        ▼             │
        table "users" {         │
            column "id"  {  ◄───┴─── Start
            }
        }
    */
    findParentResource(position : monaco.Position): Resource {
        const lineNumber = this.findParentBracket(PairCurlyBracket, position, 1, Direction.up)
        const resource = this.findResourceAtLineNumber(lineNumber)

        return resource
    }


    /*
        table "users" {  ◄──────┐
                                │
          column "id"   {  ◄────┴─┐
                                  │
            foreign_key "" {  ◄───┴─── Start

            }
          }
        }
    */

    findParentResources() {
        const resources : Resource[] = []
        let parentResource = this.findParentResource(this.position)
        
        while (parentResource != null) {
            resources.push(parentResource)
            
            const parentPosition = new monaco.Position(parentResource.lineNumber, this.position.column);    
            parentResource = this.findParentResource(parentPosition)
        }
        
        return resources.reverse()
    }

    /*
                      ▼
        table "users" { ◄─────┐
                              │
            column "id" { ◄───┴── Start
    */

    findParentBracket(
        pairBracket: Bracket = PairCurlyBracket, position: monaco.Position = null, 
        level = 1, direction: Direction = Direction.up) : number {
        if (position == null) return
        let lineNumber = position.lineNumber

        let bracketcount = level
        while (bracketcount > 0) {
            // Move cursor to each line depend on direction
            direction == Direction.down ? lineNumber++ : lineNumber--

            // EOF
            if ((lineNumber == 0 || lineNumber > this.textModel.getLineCount()) || 
                Number.isNaN(lineNumber) || lineNumber == null ) return 

            const brackets = this.textModel.getLineContent(lineNumber).match(HCL_REGEX_FUNC.bracket(pairBracket));
            
            if (brackets != null) {
                brackets.reverse().forEach(bracket => {
                    const isUp = direction === Direction.up;
                    bracketcount += (bracket === (isUp ? pairBracket.open : pairBracket.close)) ? -1 : 1;
                });
            }
        }
        
        return lineNumber
    }

    /*
                                        table  "users"  {
                                          │
                            │  ◄──────────┘ column  "id"  {
                            │                │
        [table,column,type] │    ◄───────────┘ type  =  int
                            │                   │
                            │      ◄────────────┘
    */
    
    listScopes() : string[] {
        const scopes : string[] = []
        const resources = this.findParentResources()

        resources.forEach((resource) => {
            scopes.push(resource.resource)
        })

        let attributeType;
        const lineContent = this.textModel.getLineContent(this.position.lineNumber)
        while ((attributeType = HCL_REGEX.attributeType.exec(lineContent)) !== null) {
            scopes.push(attributeType[1])
        }
        
        return scopes
    }

    /*
        table  "admin"  "users"  {
        ─────   ─────    ─────
          ▲       ▲       ▲
          │       │       │
       resource  ─┴───────┴─
                    values
    */

    findResourceAtLineNumber(lineNumber : number) : Resource {
        const resourceType = this.textModel.getLineContent(lineNumber)?.match(HCL_REGEX.resourceType);
        const resourceValues : string[] = []
        
        if (resourceType == null) return

        let match;
        while ((match = HCL_REGEX.resourceValue.exec(this.textModel.getLineContent(lineNumber))) !== null) {
            resourceValues.push(match[1])
        }

        return {
            resource: resourceType[1],
            values: resourceValues,
            lineNumber: lineNumber
        }
    }

    /*
        table.users.column.id.
                │
                │
                ▼
        [table,users,column,id]
    */

    parseCurrentWordToPath() : string[] {
        const path : string[] = []
        let match;

        const rawPath = this.textModel.getLineContent(this.position.lineNumber).match(HCL_REGEX.rawPath)[0]
        while ((match = HCL_REGEX.path.exec(rawPath)) !== null) {
            path.push(match[1])
        }
        
        return path
    }

    // 1 = Outer | 2 = Inter | 0 = undefined
    compareRange(src : monaco.IRange, dst : monaco.IRange) : number {
        if (src.startLineNumber <= dst.startLineNumber && src.endLineNumber >= dst.endLineNumber) {
            return 1
        } else if (src.startLineNumber >= dst.startLineNumber && src.endLineNumber <= dst.endLineNumber) {
            return 2
        } else {
            return 0
        }
    }

    /*
        table  "users"  {

             column  "id"  {  ◄─────────────┐
                                            │
             }                              │
                                            │
             foreign_key  "user_fk"  {      │
                                            │
                columns  =  [column.  ──────┘
    */

    findReferencedResourceValues(path : string[]) : string[] {    
        let referencedResourceValues : monaco.editor.FindMatch[] = []
        
        let currentRange: monaco.IRange = {
            startColumn: 1,
            endColumn: 1,
            startLineNumber: 1,
            endLineNumber: this.textModel.getLineCount()
        }
        
        path?.forEach((v, k) => {
            if ((k + 1) % 2 === 1) {
                const matches = this.textModel.findMatches(
                    HCL_REGEX_FUNC.resourceValuebyType(v), currentRange, true, false, null, true);
                referencedResourceValues.push(...matches)
            } else {
                // remove unsed resource
                referencedResourceValues = referencedResourceValues.filter((referencedResourceValue) => {
                    return referencedResourceValue.matches[1].includes(v)
                })

                if (referencedResourceValues[0] != null) {
                    const positonAtRegexMatch = new monaco.Position(
                        referencedResourceValues[0].range.startLineNumber, 
                        referencedResourceValues[0].range.endColumn);

                    currentRange = new monaco.Range(
                        referencedResourceValues[0].range.startLineNumber,
                        referencedResourceValues[0].range.startColumn, 
                        this.findParentBracket(PairCurlyBracket, positonAtRegexMatch, 1, Direction.down),
                        this.textModel.getLineMaxColumn(currentRange.endLineNumber ))     
                }

                referencedResourceValues = []
            }
        });

        let values : string[] = []
        referencedResourceValues?.forEach((referencedResourceValue) => {
            const resource = this.findResourceAtLineNumber(referencedResourceValue.range.startLineNumber);
            values = [...values, ...resource.values]
        })

        return values
    }
}

export default HclParser