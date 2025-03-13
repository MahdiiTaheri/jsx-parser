import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import {
  JSXElement,
  JSXAttribute,
  JSXText,
  isJSXMemberExpression,
  isJSXIdentifier,
} from "@babel/types";
import { componentRegistry, defaultComponentConfig } from "./registry";
import {
  getTagName,
  parseObjectExpression,
  processAttributes,
  processChildren,
} from "./utils";

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
        if (isJSXIdentifier(nameNode)) {
          componentName = nameNode.name;
        } else if (isJSXMemberExpression(nameNode)) {
          componentName = nameNode.property.name;
        } else {
          throw new Error("Unsupported JSX element name type");
        }

        const config =
          componentRegistry[componentName] || defaultComponentConfig;

        const babelAttributes = node.openingElement.attributes.filter(
          (attr): attr is JSXAttribute => attr.type === "JSXAttribute"
        );
        const customAttributes: Attribute[] = babelAttributes.map((attr) => {
          let attrName: string;
          if (attr.name.type === "JSXIdentifier") {
            attrName = attr.name.name;
          } else {
            attrName = `${attr.name.namespace.name}:${attr.name.name.name}`;
          }
          let attrValue;
          if (attr.value) {
            if (attr.value.type === "StringLiteral") {
              attrValue = { value: attr.value.value };
            } else if (attr.value.type === "JSXExpressionContainer") {
              const expr = attr.value.expression;
              if (
                expr.type === "StringLiteral" ||
                expr.type === "NumericLiteral"
              ) {
                attrValue = { value: expr.value };
              } else if (expr.type === "ObjectExpression") {
                attrValue = { value: parseObjectExpression(expr) };
              }
            }
          }
          return {
            name: { name: attrName },
            value: attrValue,
          };
        });

        const { id, props } = processAttributes(customAttributes);

        const textChildren = node.children
          .filter((child): child is JSXText => child.type === "JSXText")
          .map((child) => ({
            type: child.type,
            value: child.value,
          }));
        const textContent = processChildren(textChildren);
        if (textContent) props.children = textContent;

        const elementId = id ? String(id) : `element-${idCounter++}`;
        const element: ParsedElement = {
          id: elementId,
          component: config.component,
          props: {
            ...props,
            ...(config.tagNameProp && {
              as: getTagName(config as TagNameConfig, props, componentName),
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
