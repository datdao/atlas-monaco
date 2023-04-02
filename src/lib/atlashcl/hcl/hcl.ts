enum SuggestionType {
  block = "block",
  attribute = "attribute",
  attributeValue = "attribute_value",
}

type Suggestion = {
  type: SuggestionType;
  value: string;
  aliases?: string[];
  desc?: string;
  config?: any;
};

type Block = {
  type: string;
  blocks: string[];
  references: string[];

  attrs: Attribute[];
};

type Attribute = {
  type: string;
  values: string;
};

export { SuggestionType, Suggestion, Block, Attribute };
