/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseGraphControl} from "@/rete/control/BaseGraphControl.ts";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {PortLabel} from "@/types/relink-graph.types.ts";
import type {RelinkGraphSocket} from "@/editor/socket";

export class BaseRelinkGraphNodeControl extends BaseGraphControl<RelinkGraphSocket> {
  public readonly node: BaseRelinkGraphNode;
  public readonly portLabel: PortLabel;


  constructor(node: BaseRelinkGraphNode, portLabel: PortLabel) {
    super(node, portLabel);

    this.node = node;
    this.portLabel = portLabel;
  }

}