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

                            
                        }

                        index "id" {
                            
                            
                        }
                    }
                `

const textModel = {
    getLineContent: jest.fn((lineNumber)=>{
        const lines = content.split("\n");
        return lines[lineNumber - 1];
    }),
    getLineCount: jest.fn(()=>{
        const lines = content.split("\n");
        return lines.length
    }),
    getWordUntilPosition: jest.fn(() => {
        return {
            word: "",
            startColumn: 1,
            endColumn: 1
        }
    }),
    findMatches: jest.fn((regexS, range) => {
        const lines = content.split('\n');
        const matches : any[] = []
        // Loop through the lines and check for matches
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i+1

            let match 
            let regex =  new RegExp(regexS, "gm")
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
    getLineMaxColumn: jest.fn(()=>{999})
}

const position = {

}

export  {
    content,
    textModel,
    position
}