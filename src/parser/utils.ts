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
  props: Record<string, string | number | undefined>;
} => {
  let id: string | null = null;
  const props: Record<string, string | number | undefined> = {};

  for (const attr of attributes) {
    const {
      name: { name },
      value,
    } = attr;
    let val: string | number | undefined =
      value?.value ?? value?.expression?.value;
    if (typeof val === "string" && !isNaN(Number(val))) {
      val = parseInt(val, 10);
    }
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
