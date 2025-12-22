import type {BaseGraphSchemes} from "@/rete/types/schemes.ts";
import type {RelinkGraphSocket} from "@/editor/socket";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import {BaseGraphNodeConnection} from "@/rete/types/connection.ts";
import type {GraphEditorContext} from "@/rete/rete-editor.tsx";
import type {IrPortEdge, NodeId, NodeType} from "@/types/relink-graph.types.ts";
import type {SourceRelinkGraphNode} from "@/editor/node/SourceRelinkGraphNode.ts";

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
  generateNewNodeName: (nodeType: NodeType) => string;
  getNodeById: (nodeId: NodeId) => BaseRelinkGraphNode | undefined;
  getConnectionByEdge: (edge: IrPortEdge) => RelinkGraphConnection | undefined;
  deleteNodeById: (nodeId: NodeId) => Promise<BaseRelinkGraphNode | undefined>;
  deleteConnectionByEdge: (edge: IrPortEdge) => Promise<RelinkGraphConnection | undefined>;
  hasEntryNode: () => SourceRelinkGraphNode | undefined;
}