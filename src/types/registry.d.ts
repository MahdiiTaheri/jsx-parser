interface ComponentConfig {
  component: string;
  tagNameProp?: string;
  defaults?: {
    as: string;
  };
  [key: string]: unknown;
}
