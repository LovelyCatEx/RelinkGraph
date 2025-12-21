/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {IrBaseNode} from "@/types/relink-graph.types.ts";

export class PureRelinkGraphNode extends BaseRelinkGraphNode {
  constructor(node: IrBaseNode) {
    super(node);
  }
}