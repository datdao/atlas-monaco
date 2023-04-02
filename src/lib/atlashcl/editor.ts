import * as Monaco from "monaco-editor";

interface ILinter {
  validateNonCompliantWordAll(
    textModel: Monaco.editor.ITextModel
  ): Monaco.editor.IModelDeltaDecoration[];
  validateNonCompliantWordLine(
    textModel: Monaco.editor.ITextModel,
    lineNumber: number
  ): Monaco.editor.IModelDeltaDecoration[];
  validateNonCompliantWord(
    textModel: Monaco.editor.ITextModel,
    position: Monaco.Position
  ): Monaco.editor.IModelDeltaDecoration;
}

class Editor {
  private linterProvider: (langId: string) => ILinter;
  private editor: Monaco.editor.IStandaloneCodeEditor;
  private linter: ILinter;

  constructor(
    editor: Monaco.editor.IStandaloneCodeEditor,
    linterProvider: (langId: string) => ILinter
  ) {
    this.editor = editor;

    this.linterProvider = linterProvider;
    this.linter = this.linterProvider(this.editor.getModel().getLanguageId());
  }

  init() {
    this.lintAll();

    this.editor.onDidChangeModelLanguage((evt) => {
      this.changeLanguage(evt.newLanguage);
    });
    this.editor.onDidChangeModelContent((evt) => {
      this.lintTyping(evt.changes[0].range);
    });
    this.editor.onDidPaste(() => {
      this.clearAllDecorations();
      this.lintAll();
    });
  }

  changeLanguage(newLang: string) {
    // Change new linter by language
    this.linter = this.linterProvider(newLang);

    // Clear old language decorations
    this.clearAllDecorations();

    // Inital lint
    this.lintAll();
  }

  clearAllDecorations() {
    const allDecorations = this.editor.getModel().getAllDecorations();
    const allDecorationIds = allDecorations.reduce((ids, decoration) => {
      ids.push(decoration.id);
      return ids;
    }, []);
    this.editor.getModel().deltaDecorations(allDecorationIds, []);
  }

  clearFollowingDecoration(
    decoration: Monaco.editor.IModelDecoration
  ): boolean {
    if (decoration.range.startLineNumber != decoration.range.endLineNumber) {
      const range: Monaco.IRange = {
        startLineNumber: decoration.range.startLineNumber,
        startColumn: decoration.range.startColumn,
        endLineNumber: decoration.range.startLineNumber,
        endColumn: this.editor
          .getModel()
          .getLineMaxColumn(decoration.range.startLineNumber),
      };

      this.editor.getModel().deltaDecorations(
        [decoration.id],
        [
          {
            ...decoration,
            range: range,
          },
        ]
      );

      return true;
    }

    return false;
  }

  lintAll() {
    const decorations = this.linter.validateNonCompliantWordAll(
      this.editor.getModel()
    );
    this.editor.getModel().deltaDecorations([], decorations);
  }

  lintTyping(range: Monaco.IRange) {
    const existedDecorationIds: string[] = [];
    this.editor
      .getModel()
      .getLineDecorations(range.endLineNumber)
      .forEach((decoration) => {
        // skip default editor decorations
        if (decoration.ownerId != 0) return;

        // clear following marker after enter
        if (this.clearFollowingDecoration(decoration)) return;

        existedDecorationIds.push(decoration.id as string);
      });

    this.editor.getModel().deltaDecorations(existedDecorationIds, []);
    const decorations = this.linter.validateNonCompliantWordLine(
      this.editor.getModel(),
      range.endLineNumber
    );
    this.editor.getModel().deltaDecorations([], decorations);
  }
}

export default Editor;
