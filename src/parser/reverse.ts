/* eslint-disable @typescript-eslint/no-explicit-any */

export function convertJSONToJSX(json: any, indentSize: number = 2): string {
  if (!json || !json.content || !Array.isArray(json.content.contents))
    throw new Error("Invalid JSON structure");

  const nodes = json.content.contents.map((node: any) => ({
    ...node,
    childrenNodes: [] as any[],
  }));
  const roots: any[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.parent_id) {
      let parentFound = false;
      for (let j = i - 1; j >= 0; j--) {
        if (nodes[j].id === node.parent_id) {
          nodes[j].childrenNodes.push(node);
          parentFound = true;
          break;
        }
      }
      if (!parentFound) {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  const jsxNodes = roots
    .map((node) => renderNode(node, 2, indentSize))
    .join("\n");

  return `function ConvertedComponent() {
    return (
  ${jsxNodes}
    );
  }
  
  export default ConvertedComponent;
  `;
}

function renderNode(node: any, level: number, indentSize: number): string {
  const indent = " ".repeat(level * indentSize);
  const componentName =
    node.component.charAt(0).toUpperCase() + node.component.slice(1);

  const { children, ...restProps } = node.props || {};
  const attributesArr: string[] = [];
  if (node.id) attributesArr.push(`id="${node.id}"`);

  for (const [key, value] of Object.entries(restProps)) {
    if (typeof value === "number" || typeof value === "boolean")
      attributesArr.push(`${key}={${value}}`);
    else attributesArr.push(`${key}="${value}"`);
  }
  const attrStr = attributesArr.length > 0 ? " " + attributesArr.join(" ") : "";

  const textContent = children && typeof children === "string" ? children : "";
  const nestedContent = node.childrenNodes
    .map((child: any) => renderNode(child, level + 1, indentSize))
    .join("\n");
  const innerContent = [textContent, nestedContent].filter(Boolean).join("\n");

  if (innerContent) {
    return `${indent}<${componentName}${attrStr}>\n${innerContent}\n${indent}</${componentName}>`;
  } else {
    return `${indent}<${componentName}${attrStr} />`;
  }
}
