/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseGraphNode} from "@/rete/node/BaseGraphNode.ts";
import {execSocket, paramSocket, type RelinkGraphSocket} from "@/editor/socket";
import type {IrBaseNode} from "@/types/relink-graph.types.ts";

export class BaseRelinkGraphNode extends BaseGraphNode<RelinkGraphSocket> {
  public readonly node: IrBaseNode;

  constructor(node: IrBaseNode) {
    super(node.nodeId);

    this.node = node;

    this.renderSockets();
  }

  public renderSockets() {
    super.clearInputs();
    super.clearOutputs();


    for (const execInput of this.node.execInputs) {
      super.addInputSocket(execInput.label, execSocket, execInput.label);
    }

    for (const execOutput of this.node.execOutputs) {
      super.addOutputSocket(execOutput.label, execSocket, execOutput.label);
    }

    for (const input of this.node.inputs) {
      super.addInputSocket(input.label, paramSocket, input.label);
    }

    for (const output of this.node.outputs) {
      super.addOutputSocket(output.label, paramSocket, output.label);
    }
  }
}