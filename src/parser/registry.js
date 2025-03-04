export const componentRegistry = {
  Layout: {
    component: "layout",
    tagNameProp: "tagName",
    defaults: { tagName: "div" },
  },
  Text: {
    component: "text",
    tagNameProp: "as",
    defaults: { tagName: "h1" },
  },
  Button: {
    component: "button",
  },
  Icon: {
    component: "icon",
  },
  // Add new components here
};

export const defaultComponentConfig = {
  type: "unknown",
  tagName: "div",
};
