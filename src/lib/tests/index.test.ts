import { AutoRegister, linterProvider, ConnectReactEditor } from '../index';
import * as monaco from 'monaco-editor'
import * as mocks from './testdata/model';

describe('index', () => {
  test('AutoRegisterToMonaco', () => {
      AutoRegister(monaco)

      expect(monaco.languages.register.call).toHaveLength(1);
      expect(monaco.languages.setLanguageConfiguration.call).toHaveLength(1);
      expect(monaco.languages.setMonarchTokensProvider.call).toHaveLength(1);
      expect(monaco.languages.registerCompletionItemProvider.call).toHaveLength(1);
  })

  describe('linterProvider', () => {
    it('Runs without crashing', () => {
      linterProvider(monaco)
    });
  })
  
  describe('ConnectReactEditor', () => {
    it('Runs without crashing', () => {
      ConnectReactEditor(mocks.editor as any, mocks.monaco as any)      
    });
  })
})

export default null
