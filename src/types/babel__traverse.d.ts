declare module "@babel/traverse" {
  import * as t from "@babel/types";

  export class NodePath<T = t.Node> {
    public node: T;
    // You can add additional members as needed.
  }

  export interface Visitor<S = {}> {
    [nodeType: string]:
      | {
          enter?(path: NodePath, state: S): void;
          exit?(path: NodePath, state: S): void;
        }
      | ((path: NodePath, state: S) => void)
      | undefined;
  }

  /**
   * Traverse an AST using the provided visitor.
   */
  export default function traverse<S = {}>(
    ast: t.Node,
    visitors: Visitor<S>,
    state?: S
  ): void;
}
