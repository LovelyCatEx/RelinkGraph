/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {NodeId, NodeType, ParamPort} from "@/types/relink-graph.types.ts";

export class PureRelinkGraphNode extends BaseRelinkGraphNode {
  constructor(
    nodeId: NodeId,
    nodeType: NodeType,
    paramInputs: ParamPort[],
    paramOutputs: ParamPort[],
  ) {
    super(nodeId, 'PURE', nodeType, [], [], paramInputs, paramOutputs);
  }
}