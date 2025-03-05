export const componentRegistry = {
  Layout: {
    component: "layout",
    tagNameProp: "as",
    defaults: { as: "div" },
  },
  Text: { component: "text", tagNameProp: "as", defaults: { as: "h1" } },
  Button: { component: "button" },
  Icon: { component: "icon" },
  Divider: { component: "divider" },
  // Additional components can be added here.
};

export const defaultComponentConfig = {
  type: "unknown",
  tagName: "div",
};
