export const componentRegistry = {
  Layout: {
    type: "layout",
    tagNameProp: "tagName",
    defaults: { tagName: "div" },
  },
  Text: {
    type: "text",
    tagNameProp: "as",
    defaults: { tagName: "h1" },
  },
  Button: {
    type: "button",
  },
  Icon: {
    type: "icon",
  },
  // Add new components here
};

export const defaultComponentConfig = {
  type: "unknown",
  tagName: "div",
};
