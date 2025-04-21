export const componentRegistry: Record<string, ComponentConfig> = {
  Layout: {
    component: "layout",
    tagNameProp: "as",
    defaults: { as: "div" },
  },
  Text: { component: "text", tagNameProp: "as", defaults: { as: "h1" } },
  Button: { component: "button" },
  Icon: { component: "icon" },
  Form: { component: "form" },
  Input: { component: "input" },
  Alert: { component: "alert" },
  Accordion: { component: "accordion" },
  Switch: { component: "switch" },
  Separator: { component: "separator" },
  AvatarUploader: { component: "avatarUploader" },
  Chart: { component: "chart" },
  Combobox: { component: "combobox" },
  Command: { component: "command" },
  DateShower: { component: "DateShower" },
  FullscreenToggle: { component: "fullscreenToggle" },
  MultiSelect: { component: "multiSelect" },
  Radio: { component: "radio" },
  Select: { component: "select" },
  // Additional components can be added here.
};

export const defaultComponentConfig: ComponentConfig = {
  type: "unknown",
  component: "unknown",
  tagName: "div",
};
