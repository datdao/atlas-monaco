import CodeCompletion, {
  addCursorIndexToQuestionMarks,
} from "../../atlashcl/codecompletion";
import { HCLNavigator } from "../../atlashcl/hcl/navigator";
import { schema, schemaConfig } from "../testdata/hcltmpl";
import { textModel } from "../testdata/model";

const hclNavigator = new HCLNavigator(schema.sqlite, schemaConfig);
const codeCompletion = new CodeCompletion(hclNavigator);

describe("codecompletion", () => {
  test("buildBlockTemplate", () => {
    expect(codeCompletion.buildBlockTemplate("table")).toEqual({
      label: "table",
      kind: 0,
      detail: "",
      insertText: "table" + ' "${1}" {\n\t${0}\n}',
      insertTextRules: 4,
      range: null,
    });
  });

  test("buildReferenceTemplate", () => {
    expect(codeCompletion.buildReferenceTemplate("table")).toEqual({
      label: "table",
      kind: 0,
      insertText: "table",
      insertTextRules: 4,
      range: null,
    });
  });

  test("buildAttributeTemplate", () => {
    expect(codeCompletion.buildAttributeTemplate("table")).toEqual({
      label: "table",
      kind: 4,
      insertText: "table = ",
      insertTextRules: 4,
      range: null,
    });
  });

  test("buildValueTemplate", () => {
    expect(codeCompletion.buildValueTemplate("int")).toEqual({
      label: "int",
      kind: 4,
      insertText: "int" + "\n${0}",
      insertTextRules: 4,
      range: null,
    });
  });

  describe("buildGlobalSearchCompletionItems", () => {
    test("default", () => {
      const completionItems = codeCompletion.buildGlobalSearchItems(["users"]);
      expect(completionItems).toEqual([
        codeCompletion.buildReferenceTemplate("users"),
      ]);
    });

    test("with 2 values", () => {
      const completionItems = codeCompletion.buildGlobalSearchItems([
        "users",
        "orders",
      ]);
      expect(completionItems).toEqual([
        codeCompletion.buildReferenceTemplate("users"),
        codeCompletion.buildReferenceTemplate("orders"),
      ]);
    });
  });

  describe("buildCompletionItems", () => {
    test("default", () => {
      const suggestions = hclNavigator.listSuggestionByNestedScopes([]);
      const completionItems = codeCompletion.buildCompletionItems(
        suggestions,
        null as any
      );

      expect(completionItems).toEqual([
        codeCompletion.buildBlockTemplate("schema"),
        codeCompletion.buildBlockTemplate("table"),
      ]);
    });

    test("lvl1 suggestion", () => {
      const suggestions = hclNavigator.listSuggestionByNestedScopes(["table"]);
      const completionItems = codeCompletion.buildCompletionItems(
        suggestions,
        null as any
      );

      expect(completionItems).toEqual([
        codeCompletion.buildBlockTemplate("index"),
        codeCompletion.buildBlockTemplate("column"),
      ]);
    });

    test("lvl2 suggestion", () => {
      const suggestions = hclNavigator.listSuggestionByNestedScopes([
        "table",
        "column",
      ]);
      const completionItems = codeCompletion.buildCompletionItems(
        suggestions,
        null as any
      );

      expect(completionItems).toEqual([
        codeCompletion.buildAttributeTemplate("comment", null as any, {
          autoGenValue: '"${?}"',
        }),
        codeCompletion.buildAttributeTemplate("type"),
      ]);
    });

    test("lvl2 value suggestion", () => {
      const suggestions = hclNavigator.listSuggestionByNestedScopes([
        "table",
        "column",
        "type",
      ]);
      const completionItems = codeCompletion.buildCompletionItems(
        suggestions,
        null as any
      );

      expect(completionItems).toEqual([
        codeCompletion.buildValueTemplate("bit"),
        codeCompletion.buildValueTemplate("binary"),
      ]);
    });

    test("default empty suggestion params", () => {
      const completionItems = codeCompletion.buildCompletionItems(
        undefined,
        null as any
      );

      expect(completionItems).toEqual([]);
    });
  });

  describe("items", () => {
    test("suggestion at root position", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 1,
        column: 1,
      };

      const range: any = {
        endColumn: 2,
        endLineNumber: 1,
        startColumn: 2,
        startLineNumber: 1,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 0, triggerCharacter: "" } as any,
        null as any
      );
      expect(result).toEqual({
        suggestions: [
          codeCompletion.buildBlockTemplate("schema", range),
          codeCompletion.buildBlockTemplate("table", range),
        ],
      });
    });

    test("suggestion at lvl1 position", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 4,
        column: 1,
      };

      const range: any = {
        endColumn: 2,
        endLineNumber: 4,
        startColumn: 2,
        startLineNumber: 4,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 0, triggerCharacter: "" } as any,
        null as any
      );
      expect(result).toEqual({
        suggestions: [
          codeCompletion.buildBlockTemplate("index", range),
          codeCompletion.buildBlockTemplate("column", range),
        ],
      });
    });

    test("suggestion at lvl2 position", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 30,
        column: 1,
      };

      const range: any = {
        endColumn: 2,
        endLineNumber: 30,
        startColumn: 2,
        startLineNumber: 30,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 0, triggerCharacter: "" } as any,
        null as any
      );
      expect(result).toEqual({
        suggestions: [
          codeCompletion.buildAttributeTemplate("comment", range, {
            autoGenValue: '"${?}"',
          }),
          codeCompletion.buildAttributeTemplate("type", range),
        ],
      });
    });

    test("suggestion at lvl2 position v2", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 35,
        column: 1,
      };

      const range: any = {
        endColumn: 2,
        endLineNumber: 35,
        startColumn: 2,
        startLineNumber: 35,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 0, triggerCharacter: "" } as any,
        null as any
      );
      expect(result).toEqual({
        suggestions: [
          codeCompletion.buildAttributeTemplate("comment", range, {
            autoGenValue: '"${1}"',
          }),
          codeCompletion.buildAttributeTemplate("columns", range, {
            autoGenValue: "[${1}]",
          }),
          codeCompletion.buildAttributeTemplate("unique", range),
          codeCompletion.buildBlockTemplate("on", range, {
            allowNullName: true,
          }),
        ],
      });
    });

    test("suggestion at lvl1 position with value", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 5,
        column: 35,
      };

      const range: any = {
        endColumn: 43,
        endLineNumber: 5,
        startColumn: 36,
        startLineNumber: 5,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 0, triggerCharacter: "" } as any,
        null as any
      );
      expect(result).toEqual({
        suggestions: [
          codeCompletion.buildValueTemplate("bit", range),
          codeCompletion.buildValueTemplate("binary", range),
        ],
      });
    });

    test("absolute path", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 22,
        column: 1,
      };

      const range: any = {
        endColumn: 2,
        endLineNumber: 22,
        startColumn: 2,
        startLineNumber: 22,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 1, triggerCharacter: "." } as any,
        null as any
      );

      expect(result).toEqual({
        suggestions: [codeCompletion.buildReferenceTemplate("id", range)],
      });
    });

    test("relative path", () => {
      const completionProvider = codeCompletion.getProvider();

      const position: any = {
        lineNumber: 21,
        column: 51,
      };

      const range: any = {
        endColumn: 52,
        endLineNumber: 21,
        startColumn: 52,
        startLineNumber: 21,
      };

      const result = completionProvider.provideCompletionItems(
        textModel as any,
        position,
        { triggerKind: 1, triggerCharacter: "." } as any,
        null as any
      );
      expect(result).toEqual({
        suggestions: [codeCompletion.buildReferenceTemplate("owner_id", range)],
      });
    });
  });
});

describe("addCursorIndexToQuestionMarks", () => {
  test("have 4 question marks", () => {
    const result = addCursorIndexToQuestionMarks(
      "numeric(${?}, ${?}, ${?})\n${?}"
    );
    expect(result).toEqual("numeric(${1}, ${2}, ${3})\n${0}");
  });

  test("have 3 question marks", () => {
    const result = addCursorIndexToQuestionMarks("numeric(${?}, ${?})\n${?}");
    expect(result).toEqual("numeric(${1}, ${2})\n${0}");
  });

  test("have 2 question marks", () => {
    const result = addCursorIndexToQuestionMarks("numeric(${?})\n${?}");
    expect(result).toEqual("numeric(${1})\n${0}");
  });

  test("have 1 question marks", () => {
    const result = addCursorIndexToQuestionMarks("numeric()\n${?}");
    expect(result).toEqual("numeric()\n${0}");
  });
});
