import * as monaco from "monaco-editor";

export const HCL_REGEX = {
  /*
        table "users" { }  => Match a first word in line "table", 
    */
  blockType: /(\w+).*(?<!["]){(?!["])/,

  /*
        table "users" { }  => Match "users"
    */
  blockValue: /"(\w+)"/g,

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
  rawPath: /(\w+\.)+([^\w]|$)|(\w+\.)+(\w+$)/g,
};

type Block = {
  block: string;
  values: string[];
  lineNumber: number;
};

export const HCL_REGEX_FUNC = {
  bracket: (bracket: Bracket) => {
    return new RegExp(`${bracket.open}|${bracket.close}`, "gm");
  },

  blockValuebyType: (type: string) => {
    return `${type}(.*)\\{`;
  },
};

export const enum Direction {
  up = "up",
  down = "down",
}

export type Bracket = {
  open: string;
  close: string;
};

export const PairCurlyBracket: Bracket = {
  open: "{",
  close: "}",
};

export class HCLParser {
  private textModel: monaco.editor.ITextModel;
  private position: monaco.Position;

  constructor(
    textModel?: monaco.editor.ITextModel,
    position?: monaco.Position
  ) {
    this.textModel = textModel;
    this.position = position;
  }

  /*
        Position          Range
            |    ---->      |
            v               v
        Schema         |Schema|
            -
    */

  getWordRange(): monaco.IRange {
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

  findParentBlock(position: monaco.Position): Block {
    const lineNumber = this.findParentBracket(
      PairCurlyBracket,
      position,
      1,
      Direction.up
    );
    const block = this.findBlockAtLineNumber(lineNumber);

    return block;
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

  findParentBlocks(): Block[] {
    const blocks: Block[] = [];
    let parentBlock = this.findParentBlock(this.position);

    while (parentBlock != null) {
      blocks.push(parentBlock);

      const parentPosition = new monaco.Position(parentBlock.lineNumber, 0);
      parentBlock = this.findParentBlock(parentPosition);
    }

    return blocks.reverse();
  }

  /*
                      ▼
        table "users" { ◄─────┐
                              │
            column "id" { ◄───┴── Start
    */

  findParentBracket(
    pairBracket: Bracket = PairCurlyBracket,
    position: monaco.Position = null,
    level = 1,
    direction: Direction = Direction.up
  ): number {
    if (position == null) return;
    const isDown = direction === Direction.down;
    let lineNumber = isDown ? position.lineNumber - 1 : position.lineNumber + 1;
    let column = position.column;

    let bracketcount = level;
    while (bracketcount > 0) {
      // Move cursor to each line depend on direction
      isDown ? lineNumber++ : lineNumber--;
      if (lineNumber < 1 || lineNumber > this.textModel.getLineCount()) return;

      column = this.textModel.getLineMaxColumn(lineNumber);

      let startColumn = this.textModel.getLineMinColumn(lineNumber);
      if (lineNumber == position.lineNumber) {
        column = position.column;
        startColumn = position.column;
      }

      const range = {
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: startColumn,
        endColumn: column,
      };

      const brackets = this.textModel
        .getValueInRange(range)
        .match(HCL_REGEX_FUNC.bracket(pairBracket));
      if (brackets != null) {
        brackets.reverse().forEach((bracket) => {
          bracketcount +=
            bracket === (!isDown ? pairBracket.open : pairBracket.close)
              ? -1
              : 1;
        });
      }
    }

    return lineNumber;
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

  listNestedScopes(): string[] {
    const scopes: string[] = [];
    const blocks = this.findParentBlocks();

    blocks.forEach((block) => {
      scopes.push(block.block);
    });

    let attributeType;
    const range: monaco.IRange = {
      startLineNumber: this.position.lineNumber,
      endLineNumber: this.position.lineNumber,
      startColumn: this.textModel.getLineMinColumn(this.position.lineNumber),
      endColumn: this.position.column,
    };

    const lineContent = this.textModel.getValueInRange(range);
    while (
      (attributeType = HCL_REGEX.attributeType.exec(lineContent)) !== null
    ) {
      scopes.push(attributeType[1]);
    }

    return scopes;
  }

  /*
        table  "admin"  "users"  {
        ─────   ─────    ─────
          ▲       ▲       ▲
          │       │       │
       block  ─┴───────┴─
                    values
    */

  findBlockAtLineNumber(lineNumber: number): Block {
    const blockType = this.textModel
      .getLineContent(lineNumber)
      ?.match(HCL_REGEX.blockType);
    const blockValues: string[] = [];

    if (blockType == null) return;

    let match;
    while (
      (match = HCL_REGEX.blockValue.exec(
        this.textModel.getLineContent(lineNumber)
      )) !== null
    ) {
      blockValues.push(match[1]);
    }

    return {
      block: blockType[1],
      values: blockValues,
      lineNumber: lineNumber,
    };
  }

  /*
        table.users.column.id.
                │
                │
                ▼
        [table,users,column,id]
    */

  parseCurrentWordToNestedScopes(): string[] {
    const scopes: string[] = [];
    let match;

    const rawPath = this.textModel
      .getLineContent(this.position.lineNumber)
      .match(HCL_REGEX.rawPath);
    while (
      rawPath != null &&
      (match = HCL_REGEX.path.exec(rawPath[0])) !== null
    ) {
      scopes.push(match[1]);
    }

    return scopes;
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

  findReferencedBlockValues(scopes: string[]): string[] {
    let referencedBlockValues: monaco.editor.FindMatch[] = [];

    let currentRange: monaco.IRange = {
      startColumn: 1,
      endColumn: 1,
      startLineNumber: 1,
      endLineNumber: this.textModel.getLineCount(),
    };

    scopes?.forEach((scope, idx) => {
      if ((idx + 1) % 2 === 1) {
        const matches = this.textModel.findMatches(
          HCL_REGEX_FUNC.blockValuebyType(scope),
          currentRange,
          true,
          false,
          null,
          true
        );
        referencedBlockValues.push(...matches);
      } else {
        // remove unsed block
        referencedBlockValues = referencedBlockValues.filter(
          (referencedBlockValue) => {
            return referencedBlockValue.matches[1].includes(scope);
          }
        );

        if (referencedBlockValues[0] != null) {
          const endColumnOfLine =
            this.textModel.getLineMaxColumn(
              referencedBlockValues[0].range.startLineNumber
            ) + 1;
          const positonAtRegexMatch = new monaco.Position(
            referencedBlockValues[0].range.startLineNumber,
            endColumnOfLine
          );

          const nextSearchedRange = new monaco.Range(
            referencedBlockValues[0].range.startLineNumber,
            endColumnOfLine,
            this.findParentBracket(
              PairCurlyBracket,
              positonAtRegexMatch,
              1,
              Direction.down
            ),
            this.textModel.getLineMinColumn(currentRange.endLineNumber)
          );

          currentRange = nextSearchedRange;
        }

        referencedBlockValues = [];
      }
    });

    let values: string[] = [];
    referencedBlockValues?.forEach((referencedBlockValue) => {
      const block = this.findBlockAtLineNumber(
        referencedBlockValue.range.startLineNumber
      );
      values = [...values, ...block.values];
    });

    return values;
  }
}
