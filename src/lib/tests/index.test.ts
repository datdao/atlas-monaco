import { Dialect } from '../dialect';
import { AutoRegisterToMonaco } from '../index';
import * as monaco from 'monaco-editor'

describe('index', () => {
  test('AutoRegisterToMonaco', () => {
      AutoRegisterToMonaco(Dialect.mysql)

      expect(monaco.languages.register.call).toHaveLength(1);
      expect(monaco.languages.setLanguageConfiguration.call).toHaveLength(1);
      expect(monaco.languages.setMonarchTokensProvider.call).toHaveLength(1);
      expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(1);
  })
  
  test('registerCompletionItemProvider', () => {
      const { registerCompletionItemProvider } = AutoRegisterToMonaco(Dialect.mysql)
      registerCompletionItemProvider(Dialect.mysql)

      expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(1);

  })
  
})

export default null
