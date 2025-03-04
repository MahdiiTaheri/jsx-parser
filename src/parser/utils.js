export const getTagName = (config, props, componentName) =>
  config.tagName ||
  (config.tagNameProp
    ? props[config.tagNameProp] || config.defaults?.tagName
    : componentName.toLowerCase());

export const processAttributes = (attributes) => {
  let id = null;
  const props = {};
  for (const attr of attributes) {
    const {
      name: { name },
      value,
    } = attr;
    let val = value?.value ?? value?.expression?.value;
    if (typeof val === "string" && !isNaN(val)) val = parseInt(val, 10);
    if (name === "id") {
      id = val;
      continue;
    }
    props[name] = val;
  }
  return { id, props };
};

export const processChildren = (children) => {
  let text = "";
  for (const child of children) {
    if (child.type === "JSXText") {
      const trimmed = child.value.trim();
      if (trimmed) text += trimmed;
    }
  }
  return text;
};
