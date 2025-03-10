interface JsonStructure {
  content: {
    layout_file?: string;
    contents: NodeJSON[];
  };
}

interface NodeJSON {
  id?: string;
  component: string;
  props?: Record<string, unknown>;
  parent_id?: string;
}

interface ParsedNode extends NodeJSON {
  childrenNodes: ParsedNode[];
}
