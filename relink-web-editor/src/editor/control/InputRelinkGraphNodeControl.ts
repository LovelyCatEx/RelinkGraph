/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseRelinkGraphNodeControl} from "@/editor/control/BaseRelinkGraphNodeControl.ts";
import type {PortLabel} from "@/types/relink-graph.types.ts";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";

export class InputRelinkGraphNodeControl extends BaseRelinkGraphNodeControl {
  public readonly onValuedChanged: (newValue: string) => void;

  constructor(
    node: BaseRelinkGraphNode,
    portLabel: PortLabel,
    onValuedChanged: (newValue: string) => void
  ) {
    super(node, portLabel);

    this.onValuedChanged = onValuedChanged;
  }
}