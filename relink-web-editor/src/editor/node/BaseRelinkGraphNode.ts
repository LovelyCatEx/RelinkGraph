/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseGraphNode} from "@/rete/node/BaseGraphNode.ts";
import {execSocket, paramSocket, type RelinkGraphSocket} from "@/editor/socket";
import type {INodePort, IrBaseNode, PortLabel} from "@/types/relink-graph.types.ts";
import {BaseRelinkGraphNodeControl} from "@/editor/control/BaseRelinkGraphNodeControl.ts";
import {InputRelinkGraphNodeControl} from "@/editor/control/InputRelinkGraphNodeControl.ts";

export class BaseRelinkGraphNode extends BaseGraphNode<RelinkGraphSocket, BaseRelinkGraphNodeControl> {
  public readonly node: IrBaseNode;

  constructor(
    node: IrBaseNode,
    private readonly onInputControlValueChanged?: (v: any, portLabel: PortLabel, node: BaseRelinkGraphNode) => void,
    private readonly onOutputControlValueChanged?: (v: any, portLabel: PortLabel, node: BaseRelinkGraphNode) => void,
  ) {
    super(node.nodeId);

    this.node = node;

    this.renderSocketsAndControls();
  }

  public findInputSocket(label: PortLabel): INodePort | undefined {
    return ([...this.node.execInputs, ...this.node.inputs]).find((port: INodePort) => port.label == label);
  }

  public findOutputSocket(label: PortLabel): INodePort | undefined {
    return ([...this.node.execOutputs, ...this.node.outputs]).find((port: INodePort) => port.label == label);
  }

  public renderSocketsAndControls() {
    super.clearInputs();
    super.clearInputSocketControls();
    super.clearOutputs();
    super.clearOutputSocketControls();


    for (const execInput of this.node.execInputs) {
      super.addInputSocket(execInput.label, execSocket, execInput.label);
    }

    for (const execOutput of this.node.execOutputs) {
      super.addOutputSocket(execOutput.label, execSocket, execOutput.label);
    }

    for (const input of this.node.inputs) {
      super.addInputSocket(input.label, paramSocket, input.label);
      super.addInputSocketControl(
        input.label,
        new InputRelinkGraphNodeControl(
          this,
          input.label,
          (v) => {
            this.onInputControlValueChanged?.(v, input.label, this);
          }
        )
      );
    }

    for (const output of this.node.outputs) {
      super.addOutputSocket(output.label, paramSocket, output.label);
      super.addOutputSocketControl(
        output.label,
        new InputRelinkGraphNodeControl(
          this,
          output.label,
          (v) => {
            console.log(v, "1151555115")
            this.onOutputControlValueChanged?.(v, output.label, this);
          }
        )
      );
    }
  }
}