/* eslint-disable @typescript-eslint/no-explicit-any */

export const getTagName = (
  config: any,
  props: any,
  componentName: string
): string =>
  config.tagName ||
  (config.tagNameProp
    ? props[config.tagNameProp] || config.defaults?.tagName
    : componentName.toLowerCase());

export const processAttributes = (
  attributes: any[]
): { id: string | null; props: any } => {
  let id: string | null = null;
  const props: any = {};
  for (const attr of attributes) {
    const {
      name: { name },
      value,
    } = attr;
    let val = value?.value ?? value?.expression?.value;
    if (typeof val === "string" && !isNaN(Number(val))) {
      val = parseInt(val, 10);
    }
    if (name === "id") {
      id = val;
      continue;
    }
    props[name] = val;
  }
  return { id, props };
};

export const processChildren = (children: any[]): string => {
  let text = "";
  for (const child of children) {
    if (child.type === "JSXText") {
      const trimmed = child.value.trim();
      if (trimmed) text += trimmed;
    }
  }
  return text;
};
