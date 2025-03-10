export const INPUT_PLACEHOLDER = `function Main() {
  return (
    <Layout id="layout-1" as="div" display="flex">
      This is a placeholder text
    </Layout>
  );
}

export default Main;`;

export const OUTPUT_PLACEHOLDER = `{
  "content": {
    "layout_file": "dashboard",
    "contents": [
      {
        "id": "layout-1",
        "component": "layout",
        "props": {
          "as": "div",
          "display": "flex",
          "children": "This is a placeholder text"
        }
      }
    ]
  }
}`;
