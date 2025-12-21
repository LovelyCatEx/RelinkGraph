/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {ExecPort, NodeId, NodeType, ParamPort} from "@/types/relink-graph.types.ts";

export class ActionRelinkGraphNode extends BaseRelinkGraphNode {
  constructor(
    nodeId: NodeId,
    nodeType: NodeType,
    execInputs: ExecPort[],
    execOutputs: ExecPort[],
    paramInputs: ParamPort[],
    paramOutputs: ParamPort[],
  ) {
    super(nodeId, 'ACTION', nodeType, execInputs, execOutputs, paramInputs, paramOutputs);
  }
}