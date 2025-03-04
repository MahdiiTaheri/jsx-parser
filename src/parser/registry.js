export const componentRegistry = {
  Layout: {
    type: "layout",
    tagNameProp: "tagName",
    defaults: { tagName: "div" },
  },
  Heading: {
    type: "heading",
    tagNameProp: "as",
    defaults: { tagName: "h1" },
  },
  Paragraph: {
    type: "paragraph",
    tagNameProp: "as",
    defaults: { tagName: "p" },
  },
  Button: {
    type: "button",
    tagName: "button",
  },
  // Add new components here
};

export const defaultComponentConfig = {
  type: "unknown",
  tagName: "div",
};
