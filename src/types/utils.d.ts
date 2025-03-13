interface AttributeValue {
  value?: string | number | boolean | Record<string, unknown>;
  expression?: {
    value: string | number | Record<string, unknown>;
  };
}

interface Attribute {
  name: {
    name: string;
  };
  value?: AttributeValue;
}

interface TagNameConfig {
  tagName?: string;
  tagNameProp?: string;
  defaults?: {
    as?: string;
  };
}

interface JSXChild {
  type: string;
  value: string;
}
