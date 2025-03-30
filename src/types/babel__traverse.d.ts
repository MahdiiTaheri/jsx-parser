declare module "@babel/traverse" {
  import * as t from "@babel/types";

  export class NodePath<T = t.Node> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    replaceWith(arg0: { type: string; value: unknown }) {
      throw new Error("Method not implemented.");
    }
    public node: T;
  }

  export interface Visitor<S = object> {
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
  export default function traverse<S = object>(
    ast: t.Node,
    visitors: Visitor<S>,
    state?: S
  ): void;
}
