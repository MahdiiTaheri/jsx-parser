interface ParsedElement {
  id: string;
  component: string;
  props: Record<string, string | number | undefined>;
  parent_id?: string;
}
