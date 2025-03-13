export const componentRegistry: Record<string, ComponentConfig> = {
  Layout: {
    component: "layout",
    tagNameProp: "as",
    defaults: { as: "div" },
  },
  Text: { component: "text", tagNameProp: "as", defaults: { as: "h1" } },
  Button: { component: "button" },
  Icon: { component: "icon" },
  Divider: { component: "divider" },
  Form: { component: "form" },
  Input: { component: "input" },
  // Additional components can be added here.
};

export const defaultComponentConfig: ComponentConfig = {
  type: "unknown",
  component: "unknown",
  tagName: "div",
};
