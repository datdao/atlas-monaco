import { Suggestion, SuggestionType } from "./hcl";

export class HCLNavigator {
  private tmpl: any;
  private tmplConf: Record<any, any> = {};
  private scopeSuggestions: Record<string, Suggestion[]> = {};

  constructor(tmpl: any, tmplConf: any = null) {
    this.tmpl = tmpl;
    this.tmplConf = tmplConf;

    this.convertTemplate();
  }

  private convertTemplate(nestedScopes: string[] = [], tmpl: any = null) {
    if (tmpl == null) {
      tmpl = this.tmpl;
    }

    Object.entries(tmpl).forEach(([key, value]) => {
      const definedScopes = [...nestedScopes];
      nestedScopes.push(key);

      const config =
        this.tmplConf != null ? this.tmplConf[nestedScopes.join(".")] : null;
      switch (Object.prototype.toString.call(value)) {
        case "[object Object]":
          this.setScopeSuggestion(
            definedScopes,
            key,
            SuggestionType.block,
            config
          );

          // [IMPORTANT] trigger recursion
          this.convertTemplate([...nestedScopes], value);
          break;
        case "[object Array]":
          // Push Attribute completion Items
          this.setScopeSuggestion(
            definedScopes,
            key,
            SuggestionType.attribute,
            config
          );

          Object.entries(value).forEach(([idx]) => {
            this.setScopeSuggestion(
              nestedScopes,
              value[idx],
              SuggestionType.attributeValue
            );
          });
          break;
        case "[object String]":
          this.setScopeSuggestion(
            definedScopes,
            key,
            SuggestionType.attribute,
            {
              autoGenValue: value,
            }
          );

          this.setScopeSuggestion(
            nestedScopes,
            value as string,
            SuggestionType.attributeValue
          );
          break;
      }

      nestedScopes = nestedScopes.filter((nestedScope) => {
        return nestedScope !== key;
      });
    });
  }

  private setScopeSuggestion(
    nestedScopes: string[],
    value: string,
    type: SuggestionType,
    tmplConf: any = null
  ) {
    const desc = tmplConf?.desc;
    const aliases = tmplConf?.aliases;
    const key = nestedScopes.join(".");

    const suggestion: Suggestion = {
      type: type,
      value: value,
      desc: desc,
      aliases: aliases,
      config: tmplConf,
    };

    if (this.scopeSuggestions[key] == null) {
      this.scopeSuggestions[key] = [suggestion];
    } else {
      this.scopeSuggestions[key].push(suggestion);
    }
  }

  listSuggestionByNestedScopes(nestedScopes: string[]): Suggestion[] {
    return this.scopeSuggestions[nestedScopes.join(".")] ?? [];
  }
}
