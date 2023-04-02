import { AutoRegister, linterProvider, ConnectEditor } from "../index";
import * as monaco from "monaco-editor";
import * as mocks from "./testdata/model";

describe("index", () => {
  test("AutoRegisterToMonaco", () => {
    AutoRegister(monaco);

    expect(monaco.languages.register.call).toHaveLength(1);
    expect(monaco.languages.setLanguageConfiguration.call).toHaveLength(1);
    expect(monaco.languages.setMonarchTokensProvider.call).toHaveLength(1);
    expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(
      1
    );
  });

  describe("linterProvider", () => {
    it("Runs without crashing", () => {
      linterProvider(monaco);
    });
  });

  describe("ConnectReactEditor", () => {
    it("Runs without crashing", () => {
      ConnectEditor(mocks.monaco as any, mocks.editor as any);
    });
  });
});

export default null;
