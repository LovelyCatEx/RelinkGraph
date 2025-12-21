/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseGraphNode} from "@/rete/node/BaseGraphNode.ts";
import {execSocket, paramSocket, type RelinkGraphSocket} from "@/editor/socket";
import type {ExecPort, NodeId, NodeRole, NodeType, ParamPort} from "@/types/relink-graph.types.ts";

export class BaseRelinkGraphNode extends BaseGraphNode<RelinkGraphSocket> {
  public readonly nodeId: NodeId;
  public readonly nodeRole: NodeRole;
  public readonly nodeType: NodeType;
  public execInputs: ExecPort[];
  public execOutputs: ExecPort[];
  public paramInputs: ParamPort[];
  public paramOutputs: ParamPort[];

  constructor(
    nodeId: NodeId,
    nodeRole: NodeRole,
    nodeType: NodeType,
    execInputs: ExecPort[],
    execOutputs: ExecPort[],
    paramInputs: ParamPort[],
    paramOutputs: ParamPort[],
  ) {
    super(nodeId);

    this.nodeId = nodeId;
    this.nodeRole = nodeRole;
    this.nodeType = nodeType;
    this.execInputs = execInputs;
    this.execOutputs = execOutputs;
    this.paramInputs = paramInputs;
    this.paramOutputs = paramOutputs;

    this.renderSockets();
  }

  public renderSockets() {
    super.clearInputs();
    super.clearOutputs();


    for (const execInput of this.execInputs) {
      super.addInputSocket(execInput.label, execSocket, execInput.label);
    }

    for (const execOutput of this.execOutputs) {
      super.addOutputSocket(execOutput.label, execSocket, execOutput.label);
    }

    for (const input of this.paramInputs) {
      super.addInputSocket(input.label, paramSocket, input.label);
    }

    for (const output of this.paramOutputs) {
      super.addOutputSocket(output.label, paramSocket, output.label);
    }
  }
}