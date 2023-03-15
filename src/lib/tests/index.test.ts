import { Dialect } from '../dialect';
import AtlasHcl, { AutoRegisterToMonaco } from '../index';
import * as monaco from 'monaco-editor'

describe('index', () => {
  test('AutoRegisterToMonaco', () => {
      AutoRegisterToMonaco(Dialect.sql)

      expect(monaco.languages.register.call).toHaveLength(1);
      expect(monaco.languages.setLanguageConfiguration.call).toHaveLength(1);
      expect(monaco.languages.setMonarchTokensProvider.call).toHaveLength(1);
      expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(1);
  })
  
  test('registerCompletionItemProvider', () => {
      let { registerCompletionItemProvider } = AutoRegisterToMonaco(Dialect.sql)
      registerCompletionItemProvider(Dialect.sql)

      expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(1);

  })
  
})

export default null
