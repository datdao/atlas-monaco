/*
   The Mocked Monaco textModel is a temporary solution because currently Jest doesn't support ESM loader
   https://jestjs.io/docs/ecmascript-modules (experimental)
*/

const content = 
                `
                    table "users" {
                        schema = schema.
                        column "id" {
                            type = integer
                        }
                        primary_key {
                            columns = [column.id]
                        }
                    }
                    
                    table "orders" "orders2" {
                        schema = schema.market
                        column "owner_id" {
                            type = integer
                            on {

                            }
                        }
                        foreign_key "owner_id" {
                            columns     = [column.]
                            ref_columns = [table.users.column.]
                            on_update   = NO_ACTION
                            on_delete   = NO_ACTION
                        }
                    }

                    table "customers" {
                        column "id" {
                            type = bit
                            comment = ""
                        }

                        index "id" {
                            
                            
                        }
                    }

                    var

                `
interface IRange {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
}
const position = {}
const emptyTextModel = {
    getLanguageId: jest.fn(),
    getValue: jest.fn(),
    getLineContent: jest.fn(),
    getLineCount: jest.fn(),
    getWordUntilPosition: jest.fn(),
    getWordAtPosition: jest.fn(),
    findMatches: jest.fn(),
    getLineMaxColumn: jest.fn(),
    getLineMinColumn: jest.fn(),
    getValueInRange: jest.fn()
}
const monaco = {
    getRangesByTokenType: jest.fn(),
    editor: {
        tokenize: jest.fn()
    }
}
const textModel = {
    getValue: jest.fn(()=> content),
    getLineContent: jest.fn((lineNumber)=>{
        const lines = content.split("\n");
        return lines[lineNumber - 1];
    }),
    getLineCount: jest.fn(()=>{
        const lines = content.split("\n");
        return lines.length
    }),
    getWordUntilPosition: jest.fn(getWordUntilPosition),
    getWordAtPosition: jest.fn((position) => {
        getWordAtPosition(textModel, position)
    }),
    findMatches: jest.fn((regexS, range) => {
        if (range == false) {
            return findMatches(content, new RegExp(regexS, "gm"))
        }
        const lines = content.split('\n');
        const matches : any[] = []
        // Loop through the lines and check for matches
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i+1

            let match 
            const regex =  new RegExp(regexS, "gm")
            while ((match = regex.exec(line)) !== null) {
                if (lineNumber <= range.endLineNumber && lineNumber >= range.startLineNumber) {
                    matches.push({
                        matches: match,
                        range: {
                            startLineNumber: lineNumber,
                            endLineNumber: lineNumber
                        }
                    })
                }
            }
        }
        
        return matches
    }),
    getLineMaxColumn: jest.fn((line)=>{
        return getLineMaxColumn(content, line)
    }),
    getLineMinColumn: jest.fn((line)=>{
        return getLineMinColumn(content, line)
    }),
    getValueInRange: jest.fn(
        (range: IRange): string => {
            return findSubstring(content, range.startLineNumber, range.endLineNumber, range.startColumn, range.endColumn)
        }
    ),
    getLanguageId: jest.fn(()=>{
        return "atlashcl_schema_sqlite"
    }),
    deltaDecorations: jest.fn(() => {
        return []
    }),
    getAllDecorations: jest.fn(() => {
        return [{id: "1"}]
    }),
    getLineDecorations: jest.fn(getLineDecorations)
}

function getLineDecorations(lineNumber) {
    switch (lineNumber) {
        case 1:
            return [{
                range: {
                    startLineNumber: 1,
                    endLineNumber: 1,
                },
                options: {
                    isWholeLine: false,
                    hoverMessage: {},
                },
                ownerId: 0
            }]
        case 2:
            return [{
                range: {
                    startLineNumber: 1,
                    endLineNumber: 1,
                },
                options: {
                    isWholeLine: false,
                    hoverMessage: {},
                },
                ownerId: 1
            }]
        default:
            return [{
                range: {
                    startLineNumber: 1,
                    endLineNumber: 2,
                },
                options: {
                    isWholeLine: false,
                    hoverMessage: {},
                },
                ownerId: 0
            }]
    }
}

const editor = {
    getModel: jest.fn(() => {
        return textModel
    }),
    onDidChangeModelLanguage: jest.fn((func) =>{
        func({
            newLanguage: 'atlashcl_schema_sqlite'
        })
    }),
    onDidChangeModelContent: jest.fn((func) =>{
        func({
            changes:[
                {
                    range: {
                        startLineNumber:1,
                        endLineNumber:1
                    }
                }
            ]
        })
    }),
    onDidPaste: jest.fn()
}

/*
    ======================== Generated By ChatGPT ========================
*/
function findSubstring(text: string, startLine: number, endLine: number, startCol: number, endCol: number): string {
    // Split the text into lines
    const lines = text.split('\n');

    // Get the lines within the specified range
    const selectedLines = lines.slice(startLine - 1, endLine);

    // Join the lines back together with newlines
    const selectedText = selectedLines.join('\n');

    // Get the substring within the specified column range
    const substring = selectedText.substring(startCol - 1, endCol);

    return substring;
}

function getLineMaxColumn(text: string, lineNumber: number): number {
    const lines = text.split('\n');
    const line = lines[lineNumber - 1];
    return line.length;
}
  
function getLineMinColumn(text: string, lineNumber: number): number {
    const lines = text.split('\n');
    const line = lines[lineNumber - 1];
    return line.trimLeft().length + 1;
}

function getWordUntilPosition(position) {
    // Get the line at the specified position
    const line = this.getLineContent(position.lineNumber);

    // Find the start and end of the word before the position
    let startColumn = position.column;
    let endColumn = position.column;
    while (startColumn > 0 && isWordCharacter(line.charCodeAt(startColumn - 1))) {
      startColumn--;
    }
    while (endColumn < line.length && isWordCharacter(line.charCodeAt(endColumn))) {
      endColumn++;
    }

    // Return an object with the word and position information
    return {
      word: line.substring(startColumn, endColumn),
      startColumn: startColumn + 1,
      endColumn: endColumn + 1,
    };
  }

// Helper method to determine if a character is part of a word
function isWordCharacter(charCode) {
    return (
        (charCode >= 65 && charCode <= 90) || // A-Z
        (charCode >= 97 && charCode <= 122) || // a-z
        (charCode >= 48 && charCode <= 57) || // 0-9
        charCode === 95 // _
    );
}

function findMatches(str, regex) {
    const matches : any = [];
    let match;
    while ((match = regex.exec(str, "gm"))) {
      const startLine = getLineNumber(str, match.index);
      const endLine = getLineNumber(str, match.index + match[0].length);
      const startColumn = getColumn(str, match.index);
      const endColumn = getColumn(str, match.index + match[0].length);
      matches.push({
        matches: match,
        range: {
            startLineNumber: startLine,
            endLineNumber: endLine,
            startColumn: startColumn + 1,
            endColumn: endColumn + 1
        }
      });
    }
    return matches;
  }
  
  function getLineNumber(str, index) {
    let line = 1;
    for (let i = 0; i < index; i++) {
      if (str[i] === '\n') {
        line++;
      }
    }
    return line;
  }
  
  function getColumn(str, index) {
    let column = 0;
    for (let i = 0; i < index; i++) {
      if (str[i] === '\n') {
        column = 0;
      } else {
        column++;
      }
    }
    return column;
  }

function getWordAtPosition(model, position) {
// Get the line of the given position
const line = model.getLineContent(position.lineNumber);
// Split the line into words using a regular expression
const words = line.split(/\s+/);
// Iterate over the words and find the one at the given column position
for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (position.column > word.length) {
    // If the position is past the end of the current word, subtract the word length from the position column
    position.column -= (word.length + 1);
    } else {
    // If the position is within the current word, return the word
    return word;
    }
}
// If no word is found, return an empty string
return "";
}


/*
    ======================== Generated By ChatGPT ========================
*/

export  {
    content,
    textModel,
    emptyTextModel,
    editor,
    position,
    monaco
}