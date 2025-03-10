import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import {
  JSXElement,
  isJSXMemberExpression,
  isJSXIdentifier,
} from "@babel/types";
import { componentRegistry, defaultComponentConfig } from "./registry";
import { getTagName, processAttributes, processChildren } from "./utils";

interface ParsedElement {
  id: string;
  component: string;
  props: Record<string, string>;
  parent_id?: string;
}

export function parseJSXToJSON(jsx: string, layout: string = "dashboard") {
  if (typeof jsx !== "string")
    throw new Error("Invalid input: Expected string content");

  let idCounter = 0;
  const elements: ParsedElement[] = [];
  const stack: string[] = [];

  const ast = Object.freeze(
    parse(jsx, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    })
  );

  traverse(ast, {
    JSXElement: {
      enter(path: NodePath<JSXElement>) {
        const node = path.node;
        const nameNode = node.openingElement.name;
        let componentName: string;
        if (isJSXIdentifier(nameNode)) componentName = nameNode.name;
        else if (isJSXMemberExpression(nameNode))
          componentName = nameNode.property.name;
        else throw new Error("Unsupported JSX element name type");

        const config =
          componentRegistry[componentName] || defaultComponentConfig;
        const { id, props } = processAttributes(node.openingElement.attributes);
        const elementId = id ? String(id) : `element-${idCounter++}`;
        const textContent = processChildren(node.children);
        if (textContent) props.children = textContent;

        const element: ParsedElement = {
          id: elementId,
          component: config.component,
          props: {
            ...props,
            ...(config.tagNameProp && {
              as: getTagName(config, props, componentName),
            }),
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
