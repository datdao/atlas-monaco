// This regular expression matches an opening curly brace that is not followed by a closing curly brace in the same text
const bracketReg = /{|}/gm

// This regular expression will match the resource type or name
const resourceReg = /\b\w+\b(?=\s*(?:"\w|.+"|{|$))/gm

// This regular expression will match the resource type or name
const valueReg = /^\s*(\w+)\s*\=/

export function getWordRange(textModel, position) {
    var word = textModel.getWordUntilPosition(position);
    var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
    };
    return range
}

export function getParentResource(textModel, currentPosition) {
    // Find Open curly bracket that stand alone
    var bracketcount = 1
    var lineInx = currentPosition.lineNumber

    while (bracketcount > 0) {
        lineInx--

        // EOF
        if (lineInx == 0 || lineInx == NaN) {
            return
        }

        var brackets = textModel.getLineContent(lineInx).match(bracketReg);
        
        if (brackets != null) {
            brackets.reverse().map(bracket => {
                if (bracket == "{") {
                    bracketcount--
                } else {
                    bracketcount++
                }
            });
        }
    }

    // Find resource type inline
    var resource = textModel.getLineContent(lineInx).match(resourceReg);
    var resourceValue = textModel.getLineContent(lineInx).match(/"(\w+)"/g);

    if (resource == null) {
        return null
    }
    
    return {
        "resource": resource[0],
        "value": resourceValue.map((value) => {
            return value.replaceAll("\"", "")
        }),
        "line_number": lineInx
    }
}

export function getParentResources(textModel, currentPosition, stopflags = []) {
    let resources = []
    let resource = getParentResource(textModel, currentPosition)

    var value = textModel.getLineContent(currentPosition.lineNumber).match(valueReg);
    
    if (value != null) {
        resources.push({
            "resource": value[1],
            "line_number": currentPosition.lineNumber
        })
    }


    while (resource != undefined) {
        resources.push(resource)

        if (stopflags.includes(resource)) {
            return resources
        }

        let currentPositionClone = {...currentPosition}
        currentPositionClone.lineNumber = resource.line_number

        resource = getParentResource(textModel, currentPositionClone)
    }
    
    return resources.reverse()
}


const resourceValueRegex = (name) => {
    return `${name}(.*)\\{`
}

const findResourceRegex = (names) => {
    return `(${names.join("|")})`
}

export function globalSearch(textModel, path = [], position) {
    var matchesC = []

    var resources = getParentResources(textModel, position)

    var pathNew = []
    resources.forEach((v,k) => {
        if (path.includes(v.resource)) {
            
            pathNew = [...pathNew,...path]
            return
        } 
        pathNew.push(v.resource,)
        pathNew.push(v.value[0])
    })
    
    console.log(resources, pathNew)

    var currentRange = {
        startColumn: 1,
        endColumn: 1,
        lineNumber:textModel.getLineMaxColumn(textModel.getLineCount()),
        endLineNumber: textModel.getLineCount()
    }
    
    pathNew.forEach((v, k) => {
        if ((k + 1) % 2 === 1) {
            const matches = textModel.findMatches(resourceValueRegex(v), currentRange, true, false, null, true);
          
            matches.forEach((v) => {
                if (v.range.startLineNumber >= currentRange.lineNumber && v.range.endLineNumber <= currentRange.endLineNumber)  {
                    matchesC.push(v)
                }
                
            })
        } else {
            matchesC = matchesC.filter((v2) => {
                return v2.matches[1].includes(v)
            })

            currentRange.lineNumber = matchesC[0].range.startLineNumber
            currentRange.startColumn = matchesC[0].range.startColumn 
            currentRange.endLineNumber = (getRangeCloseBracket(textModel, matchesC[0].range))
            currentRange.endColumn = textModel.getLineMaxColumn(currentRange.endLineNumber )
            matchesC = []
        }
    });

    var values = []
    matchesC.forEach((v) => {
        var vv = v.matches[0].match(/"(\w+)"/gm)
        vv.forEach((vvv) => {
            values.push(vvv.replaceAll("\"", ""))
        })
    })

    return values

}

function getRangeCloseBracket(textModel, range) {
    // Find Open curly bracket that stand alone
    var bracketcount = 1
    var lineInx = range.startLineNumber
    

    while (bracketcount > 0) {
        lineInx++

        // EOF
        if (lineInx == 0 || lineInx == NaN) {
            return
        }

        var brackets = textModel.getLineContent(lineInx).match(bracketReg);
        
        if (brackets != null) {
            brackets.map(bracket => {
                if (bracket == "}") {
                    bracketcount--
                } else {
                    bracketcount++
                }
            });
        }
    }

    return lineInx
}