import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { componentRegistry, defaultComponentConfig } from "./registry.js";
import { getTagName, processAttributes, processChildren } from "./utils.js";

export function parseJSXToJSON(jsx, layout = "default") {
  if (typeof jsx !== "string")
    throw new Error("Invalid input: Expected string content");

  let idCounter = 0;
  const elements = [];
  const stack = [];

  // Freeze the AST to prevent accidental mutations.
  const ast = Object.freeze(
    parse(jsx, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    })
  );

  traverse.default(ast, {
    JSXElement: {
      enter({ node }) {
        const componentName = node.openingElement.name.name;
        const config =
          componentRegistry[componentName] || defaultComponentConfig;
        const { id, props } = processAttributes(node.openingElement.attributes);
        const elementId = id || `element-${idCounter++}`;
        const textContent = processChildren(node.children);
        if (textContent) props.children = textContent;

        const element = {
          id: elementId,
          component: config.component,
          props: {
            ...props,
            tagName: getTagName(config, props, componentName),
          },
          ...(stack.length && { parent_id: stack[stack.length - 1] }),
        };
        elements.push(element);
        stack.push(elementId);
      },
      exit() {
        stack.pop();
      },
    },
  });

  return {
    content: {
      layout_file: layout,
      contents: elements,
    },
  };
}
