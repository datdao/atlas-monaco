import * as monaco from 'monaco-editor';

const HCL_REGEX = {
    // This regular expression matches an opening curly brace that is not followed by a closing curly brace in the same text
	brackets: /{|}/gm, 
    // This regular expression will match the resource type or name
	resourceType: /\w+/,
    // This regular expression will match the resource name
	resourceValue: /"(\w+)"/g,

    attributeType: /^\s*(\w+)\s*\=/g,

	path: /(\w+)\./g,

    // Find word end with "."
    referencingWord: /([\w\.]+)\.[^\w]?$/g
}

const HCL_REGEX_FUNC = {
    // This regular expression matches an opening curly brace that is not followed by a closing curly brace in the same text
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

const enum Direction {
    up = "up",
    down = "down"
}

type Bracket = {
    open: string,
    close: string
}

const PairCurlyBracket : Bracket = {
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

    wordRange() : monaco.IRange  {
        const word = this.textModel.getWordUntilPosition(this.position);

        return {
            startLineNumber: this.position.lineNumber,
            endLineNumber: this.position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };
    }

    parentResource(position : monaco.Position = null): Resource {
        // Find Open curly bracket that stand alone
        let lineNumber = this.findParentBracket(PairCurlyBracket, position, 1, Direction.up)

        // Find resource type inline
        let resource = this.findResourceAtLineNumber(lineNumber)

        return resource
    }

    parentResources(roots : string[] = []) {
        let resources : Resource[] = []
        let parentResource = this.parentResource(this.position)
        
        while (parentResource != null) {
            resources.push(parentResource)
            
            if (roots.includes(parentResource.resource)) {
                return resources.reverse()
            }
    
            let currentPositionClone = new monaco.Position(parentResource.lineNumber, this.position.column);    
            parentResource = this.parentResource(currentPositionClone)
        }
        
    
        return resources.reverse()
    }

    findParentBracket(
        pairBracket: Bracket = PairCurlyBracket, position: monaco.Position, 
        level : number = 1, direction: Direction = Direction.up) : number {

        let lineNumber = position.lineNumber

        let bracketcount = level
        while (bracketcount > 0) {
            // Move cursor to each line depend on direction
            direction == Direction.down ? lineNumber++ : lineNumber--

            // EOF
            if (lineNumber == 0 || Number.isNaN(lineNumber)) return

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
    
    listBlockScope() : string[] {
        let scopes : string[] = []
        let resources = this.parentResources()

        resources.forEach((resource) => {
            scopes.push(resource.resource)
        })

        let attributeType;
        while ((attributeType = HCL_REGEX.attributeType.exec(this.textModel.getLineContent(this.position.lineNumber))) !== null) {
            scopes.push(attributeType[1])
        }
        
        return scopes
    }

    findResourceAtLineNumber(lineNumber : number) : Resource {
        let resourceType = this.textModel.getLineContent(lineNumber).match(HCL_REGEX.resourceType);
        let resourceValues : string[] = []
        
        if (resourceType == null) return

        let match;
        while ((match = HCL_REGEX.resourceValue.exec(this.textModel.getLineContent(lineNumber))) !== null) {
            resourceValues.push(match[1])
        }

        return {
            resource: resourceType[0],
            values: resourceValues,
            lineNumber: lineNumber
        }
    }

    parseCurrentWordToPath() : string[] {
        let content = this.textModel.getLineContent(this.position.lineNumber).match(HCL_REGEX.referencingWord)
        let path : string[] = []
        console.log(this.textModel.getLineContent(this.position.lineNumber), content, HCL_REGEX.referencingWord)
        if (content == null) {
            return path
        }

        let match;
        while ((match = HCL_REGEX.path.exec(content[0])) !== null) {
            path.push(match[1])
        }
        
        return path
    }

    fillMissingPath(path : string[]) : string[] {
        let resources = this.parentResources()
        let fullPath : string[] = []


        if (resources.length > 0 && path.includes(resources[0].resource)) {
            fullPath = [...fullPath,...path]
            return fullPath
        }

        if (resources.length == 1) {
            fullPath.push(resources[0].resource)   
            fullPath.push(resources[0].values[0])  
            return
        }

        for (let i = 0; i < resources.length - 1; i++) {
            fullPath.push(resources[i].resource)   
            fullPath.push(resources[i].values[0])  
        }

        return [...fullPath,...path]
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

    findReferencedResourceValues(path : string[]) : string[] {
        let fullPath = this.fillMissingPath(path)
        console.log(fullPath, path)
        let referencedResourceValues : monaco.editor.FindMatch[] = []
        
        let currentRange: monaco.IRange = {
            startColumn: 1,
            endColumn: 1,
            startLineNumber: 1,
            endLineNumber: this.textModel.getLineCount()
        }
        
        fullPath.forEach((v, k) => {
            if ((k + 1) % 2 === 1) {
                let matches = this.textModel.findMatches(HCL_REGEX_FUNC.resourceValuebyType(v), currentRange, true, false, null, true);

                matches.forEach((match) => {
                    if (this.compareRange(currentRange, match.range) == 1) referencedResourceValues.push(match)
                })
            } else {
                // remove unsed resource
                referencedResourceValues = referencedResourceValues.filter((referencedResourceValue) => {
                    return referencedResourceValue.matches[1].includes(v)
                })

                let positonAtRegexMatch = new monaco.Position(
                    referencedResourceValues[0].range.startLineNumber, 
                    referencedResourceValues[0].range.endColumn);

                currentRange = new monaco.Range(
                    referencedResourceValues[0].range.startLineNumber,
                    referencedResourceValues[0].range.startColumn, 
                    this.findParentBracket(PairCurlyBracket, positonAtRegexMatch, 1, Direction.down),
                    this.textModel.getLineMaxColumn(currentRange.endLineNumber ))
              
                referencedResourceValues = []
            }
        });

        let values : string[] = []
        referencedResourceValues.forEach((referencedResourceValue) => {
            let resource = this.findResourceAtLineNumber(referencedResourceValue.range.startLineNumber);
            values = [...values, ...resource.values]
        })

        return values
    }
}

export default HclParser