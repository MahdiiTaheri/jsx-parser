export function getTagName(config, props, componentName) {
  if (config.tagName) return config.tagName;
  if (config.tagNameProp)
    return props[config.tagNameProp] || config.defaults?.tagName;
  return componentName.toLowerCase();
}

export function processAttributes(attributes) {
  let id = null;
  const props = {};

  attributes.forEach((attr) => {
    const name = attr.name.name;
    let value = attr.value?.value || attr.value?.expression?.value;

    if (typeof value === "string" && !isNaN(value)) value = parseInt(value, 10);

    if (name === "id") {
      id = value;
      return;
    }

    props[name] = value;
  });

  return { id, props };
}

export function processChildren(children) {
  return children.reduce((acc, child) => {
    if (child.type === "JSXText") {
      const text = child.value.trim();
      if (text) acc += text;
    }
    return acc;
  }, "");
}
