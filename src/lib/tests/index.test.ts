import { AutoRegister } from '../index';
import * as monaco from 'monaco-editor'

describe('index', () => {
  test('AutoRegisterToMonaco', () => {
      AutoRegister(monaco)

      expect(monaco.languages.register.call).toHaveLength(1);
      expect(monaco.languages.setLanguageConfiguration.call).toHaveLength(1);
      expect(monaco.languages.setMonarchTokensProvider.call).toHaveLength(1);
      expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(1);
  })
})

export default null
