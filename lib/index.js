import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { componentRegistry, defaultComponentConfig } from "./registry.js";
import { getTagName, processAttributes, processChildren } from "./utils.js";

export function parseJSXToJSON(jsx, layout = "default") {
  if (typeof jsx !== "string")
    throw new Error("Invalid input: Expected string content");

  const elements = [];
  const stack = [];
  let idCounter = 0;

  const ast = parse(jsx, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  Object.freeze(ast);

  traverse.default(ast, {
    JSXElement: {
      enter: (path) => {
        const node = path.node;
        const componentName = node.openingElement.name.name;
        const config =
          componentRegistry[componentName] || defaultComponentConfig;

        const { id, props } = processAttributes(node.openingElement.attributes);
        const elementId = id || `element-${idCounter++}`;

        const textContent = processChildren(node.children);
        if (textContent) props.children = textContent;

        const element = {
          id: elementId,
          type: config.type,
          props: {
            ...props,
            tagName: getTagName(config, props, componentName),
          },
        };

        const parentId = stack.length ? stack[stack.length - 1] : null;
        if (parentId) element.parent_id = parentId;

        elements.push(element);
        stack.push(elementId);
      },
      exit: () => {
        stack.pop();
      },
    },
  });

  return {
    content: {
      layout: layout,
      contents: elements,
    },
  };
}
