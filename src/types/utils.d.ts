interface AttributeValue {
  value?: string | number;
  expression?: {
    value: string | number;
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
