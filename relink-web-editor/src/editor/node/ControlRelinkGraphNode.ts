/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {ExecPort, NodeId, NodeType, ParamPort} from "@/types/relink-graph.types.ts";

export class ControlRelinkGraphNode extends BaseRelinkGraphNode {
  constructor(
    nodeId: NodeId,
    nodeType: NodeType,
    execInputs: ExecPort[],
    execOutputs: ExecPort[],
    paramInputs: ParamPort[]
  ) {
    super(nodeId, 'CONTROL', nodeType, execInputs, execOutputs, paramInputs, []);
  }
}