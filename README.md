<p>&nbsp;</p>


![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

# Atlas Monaco Editor
The library integrates Atlas HCL with Monaco Editor.
[Atlas HCL Demo](https://datdao.me/atlas-monaco)

## Features
### Code Completion

Library provides robust code completion support for all SQL resources available within Atlas. For a comprehensive list of the supported resources, please visit the following link: https://atlasgo.io/atlas-schema/sql-resources.

![Code Completion Demo](assets/code_completion.gif)


### SQL Dialect
Support for configuring dialects is available for specific database drivers, such as SQLite, MySQL, and PostgreSQL, etc.

### Referencing Qualified Tables
Users are able to search for attributes from multiple data blocks while working within a specific block. This feature can assist users in locating and referencing related data with greater ease.

![Code Completion Demo](assets/references.gif)


## Installation

```bash
npm install atlas-monaco
```

## Usage

### Auto Register AtlasHCL

```ts
import { AutoRegisterToMonaco } from "../lib";
import { Dialect } from "../lib/dialect";

AutoRegisterToMonaco(Dialect.sql)

```

By using the AutoRegisterToMonaco() function, all configurations will be registered, including tokens, extensions, and completion providers.

### Manual Register AtlasHCL

```ts

const atlashcl = new AtlasHCL(dialect)
  
  // Register new language 
  monaco.languages.register({
    id: atlashcl.getLanguageName(),
    extensions: atlashcl.getLanguageExt()
  })

  // Set Tokenizer vs Language config
  monaco.languages.setLanguageConfiguration(
    atlashcl.getLanguageName(), 
    atlashcl.getLanguageConf())

  monaco.languages.setMonarchTokensProvider(
    atlashcl.getLanguageName(), 
    atlashcl.getTokenProvider()
  )

  // Register completion logic
  monaco.languages.registerCompletionItemProvide(
    atlashcl.getLanguageName(),
    atlashcl.getCompletionProvider()
  )

```

### Change Sql Dialect

```ts

const { registerCompletionItemProvider } = AutoRegisterToMonaco(Dialect.sql)

```

After using the provided function from the library, it will provide the ability to safely dispose and register again.

## Contrib

### Custom SQL Resource 
The configuration file is located at data/sql.ts. Follow these steps to configure the SQL resources:

- Use an object with key-value pairs to define a resource.
- Use a string with Attribute + Value to define a simple completion item.
- Use an array with Attribute + Value to define a completion item that supports multiple options.
- Use ${0|1|2|3} to define the position of the pointer after rendering. You can set priority by numbering the options. 
Use ${?} to auto set position

Standard datatypes:
```ts
bool: ["true", "false"],
number: "${?}",
string: "\"${?}\"",
array: "[${?}]",
switch: ["on", "off"],
ref: "${?}",
```

Example for config
```ts

mysql: {
        schema: {
            charset: dataType.string,
        },

        table: {
            schema: dataType.string,
            primary_key: {
                type: [
                    "BTREE",
                    ...
                ],
                columns: dataType.array
            },
            index: {
                comment: dataType.string,
                type: dataType.index,
                columns: dataType.array,
                unique: dataType.bool,
                on: {
                    column: dataType.string,
                    desc: dataType.bool,
                    where: dataType.string,
                    ...

```

### Project Structure

```
src
 ┣ demo
 ┃ ┣ index.css
 ┃ ┗ index.ts
 ┗ lib
 ┃ ┣ autocompletion
 ┃ ┃ ┣ hclparser.ts
 ┃ ┃ ┗ index.ts
 ┃ ┣ data
 ┃ ┃ ┗ sql.ts
 ┃ ┣ tests
 ┃ ┃ ┣ autocompletion
 ┃ ┃ ┃ ┣ testdata
 ┃ ┃ ┃ ┃ ┣ hcltmpl.ts
 ┃ ┃ ┃ ┃ ┣ model.ts
 ┃ ┃ ┃ ┃ ┗ regex.ts
 ┃ ┃ ┃ ┣ hclparser.test.ts
 ┃ ┃ ┃ ┗ index.test.ts
 ┃ ┃ ┣ atlashcl.test.ts
 ┃ ┃ ┣ dialect.test.ts
 ┃ ┃ ┗ index.test.ts
 ┃ ┣ atlashcl.ts
 ┃ ┣ config.ts
 ┃ ┣ dialect.ts
 ┃ ┣ index.ts
 ┃ ┗ monaco-hcl.d.ts
```

