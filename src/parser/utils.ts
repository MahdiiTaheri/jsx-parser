import { ObjectExpression } from "@babel/types";

export const getTagName = (
  config: TagNameConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>,
  componentName: string
): string =>
  config.tagName ||
  (config.tagNameProp
    ? props[config.tagNameProp] || config.defaults?.as
    : componentName.toLowerCase());

export const processAttributes = (
  attributes: Attribute[]
): {
  id: string | null;
  props: Record<string, unknown>;
} => {
  let id: string | null = null;
  const props: Record<string, unknown> = {};

  for (const attr of attributes) {
    const {
      name: { name },
      value,
    } = attr;
    let val = value?.value ?? value?.expression?.value;
    if (typeof val === "number") val = Number(val);
    if (name === "id") {
      id = val as string;
      continue;
    }
    props[name] = val;
  }
  return { id, props };
};

export const processChildren = (children: JSXChild[]): string => {
  let text = "";
  for (const child of children) {
    if (child.type === "JSXText") {
      const trimmed = child.value.trim();
      if (trimmed) text += trimmed;
    }
  }
  return text;
};

export function parseObjectExpression(expr: ObjectExpression) {
  const obj: Record<string, unknown> = {};
  expr.properties.forEach((prop) => {
    if (prop.type === "ObjectProperty") {
      let key: string;
      if (prop.key.type === "Identifier") {
        key = prop.key.name;
      } else if (prop.key.type === "StringLiteral") {
        key = prop.key.value;
      } else {
        key = "unknown";
      }
      let value;
      if (prop.value.type === "StringLiteral") {
        value = prop.value.value;
      } else if (prop.value.type === "NumericLiteral") {
        value = prop.value.value;
      } else if (prop.value.type === "BooleanLiteral") {
        value = prop.value.value;
      } else if (prop.value.type === "ObjectExpression") {
        value = parseObjectExpression(prop.value);
      } else {
        // Optionally add more type handling here
        value = null;
      }
      obj[key] = value;
    }
  });
  return obj;
}
