import type {BaseGraphSchemes} from "@/rete/types/schemes.ts";
import type {RelinkGraphSocket} from "@/editor/socket";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import {BaseGraphNodeConnection} from "@/rete/types/connection.ts";
import type {GraphEditorContext} from "@/rete/rete-editor.tsx";
import type {NodeId} from "@/types/relink-graph.types.ts";

export class RelinkGraphConnection extends BaseGraphNodeConnection<
  RelinkGraphSocket,
  BaseRelinkGraphNode,
  BaseRelinkGraphNode
> {}

export type RelinkGraphSchemes = BaseGraphSchemes<
  RelinkGraphSocket,
  BaseRelinkGraphNode,
  RelinkGraphConnection
>;

export interface RelinkGraphEditorContext extends GraphEditorContext<
  RelinkGraphSocket,
  BaseRelinkGraphNode,
  RelinkGraphConnection,
  RelinkGraphSchemes
> {
  getNodeById: (nodeId: NodeId) => BaseRelinkGraphNode | undefined;
}