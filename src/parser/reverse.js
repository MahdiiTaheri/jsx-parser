export function convertJSONToJSX(json, indentSize = 2) {
  if (!json || !json.content || !Array.isArray(json.content.contents)) {
    throw new Error("Invalid JSON structure");
  }
  // Create a shallow copy of nodes and add an array for nested children.
  const nodes = json.content.contents.map((node) => ({
    ...node,
    childrenNodes: [],
  }));
  const roots = [];

  // Reconstruct the tree.
  // Since the original parser did a DFS, the parent of any node is the most recent node (before it) whose id matches the node’s parent_id.
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
        // Fallback: if parent_id is not found, treat as a root.
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  // Render each root node recursively.
  const jsxNodes = roots
    .map((node) => renderNode(node, 2, indentSize))
    .join("\n");

  // Wrap the generated JSX in a function component.
  return `function ConvertedComponent() {
    return (
  ${jsxNodes}
    );
  }
  
  export default ConvertedComponent;
  `;
}

function renderNode(node, level, indentSize) {
  const indent = " ".repeat(level * indentSize);
  // Convert the stored component (e.g. "layout") to a PascalCase JSX tag (e.g. "Layout").
  const componentName =
    node.component.charAt(0).toUpperCase() + node.component.slice(1);

  // Build attribute string from props.
  // Exclude the "children" property, as that is reserved for inner text.
  const { children, ...restProps } = node.props || {};
  const attributesArr = [];
  // Add the node's id as a prop if available.
  if (node.id) {
    attributesArr.push(`id="${node.id}"`);
  }
  for (const [key, value] of Object.entries(restProps)) {
    if (typeof value === "number" || typeof value === "boolean") {
      attributesArr.push(`${key}={${value}}`);
    } else {
      attributesArr.push(`${key}="${value}"`);
    }
  }
  const attrStr = attributesArr.length > 0 ? " " + attributesArr.join(" ") : "";

  // Inner content: combine any text from props.children and any nested JSX elements.
  const textContent = children && typeof children === "string" ? children : "";
  const nestedContent = node.childrenNodes
    .map((child) => renderNode(child, level + 1, indentSize))
    .join("\n");
  const innerContent = [textContent, nestedContent].filter(Boolean).join("\n");

  if (innerContent) {
    return `${indent}<${componentName}${attrStr}>\n${innerContent}\n${indent}</${componentName}>`;
  } else {
    return `${indent}<${componentName}${attrStr} />`;
  }
}
