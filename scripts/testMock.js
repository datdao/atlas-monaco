module.exports = {
    Position: jest.fn((lineNumber, column) => {
        return {
            lineNumber: lineNumber,
            column: column
        }
    }),
    Range: jest.fn((startLineNumber, startColumn, endLineNumber, endColumn) => {
        return {
            startLineNumber: startLineNumber,
            startColumn:    startColumn,
            endLineNumber:  endLineNumber,
            endColumn:  endColumn
        }
    }),
    languages: {
        register: jest.fn(()=>{}),
        setLanguageConfiguration: jest.fn(()=>{}),
        setMonarchTokensProvider: jest.fn(()=>{}),
        registerCompletionItemProvider: jest.fn(() => {
            return {
                dispose: jest.fn()
            }
        }),
        CompletionItemKind: {
            Method: 0,
            Variable: 4
        },
        CompletionItemInsertTextRule: {
            InsertAsSnippet: 4
        }
    },
};


