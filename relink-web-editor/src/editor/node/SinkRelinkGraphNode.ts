/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {IrBaseNode, PortLabel} from "@/types/relink-graph.types.ts";

export class SinkRelinkGraphNode extends BaseRelinkGraphNode {
  constructor(
    node: IrBaseNode,
    onInputControlValueChanged?: (v: any, portLabel: PortLabel, node: BaseRelinkGraphNode) => void,
    onOutputControlValueChanged?: (v: any, portLabel: PortLabel, node: BaseRelinkGraphNode) => void,
  ) {
    super(node, onInputControlValueChanged, onOutputControlValueChanged);
  }
}