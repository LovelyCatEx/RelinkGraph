import {randomUUID} from "@/utils/uuid.ts";
import type {RType} from "@/types/relink-ir.types.ts";

/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
export type NodeId = string;
export type NodeType = string;
export type PortLabel = string;

export type NodeRole = 'ACTION' | 'CONTROL' | 'PURE' | 'SOURCE' | 'SINK';

export interface INodePort {
  label: PortLabel;
}

export interface ExecPort extends INodePort {}

export interface ParamPort extends INodePort {
  type: string;
}

export function execPort(label: string = 'exec'): ExecPort {
  return {
    label: label,
  }
}

export function paramPortPlain(type: string, label: string): ParamPort {
  return {
    type: type,
    label: label
  }
}

export function paramPort(type: RType, label: string): ParamPort {
  return {
    type: type.qualifiedName,
    label: label
  }
}

export interface IrBaseNode {
  nodeId: NodeId;
  nodeRole: NodeRole;
  nodeType: NodeType;
  execInputs: ExecPort[];
  execOutputs: ExecPort[];
  inputs: ParamPort[];
  outputs: ParamPort[];
  [key: string]: unknown;
}

export interface IrPortEdge {
  from: NodeId;
  fromPort: PortLabel;
  to: NodeId;
  toPort: PortLabel;
}

export interface IrWorkflow {
  workflowName: string;
  nodes: IrBaseNode[] & {
    position?: {
      x: number,
      y: number
    }
  };
  portEdges: IrPortEdge[]
}

export interface IrRelinkGraph {
  graphName: string,
  workflows: IrWorkflow[]
}

export function irActionNode(
  nodeType: NodeType,
  execInputs: ExecPort[],
  execOutputs: ExecPort[],
  paramInputs: ParamPort[],
  paramOutputs: ParamPort[]
): IrBaseNode {
  return {
    nodeId: randomUUID(),
    nodeRole: 'ACTION',
    nodeType: nodeType,
    execInputs: execInputs,
    execOutputs: execOutputs,
    inputs: paramInputs,
    outputs: paramOutputs,
  }
}

export function irPureNode(
  nodeType: NodeType,
  paramInputs: ParamPort[],
  paramOutputs: ParamPort[]
): IrBaseNode {
  return {
    nodeId: randomUUID(),
    nodeRole: 'PURE',
    nodeType: nodeType,
    execInputs: [],
    execOutputs: [],
    inputs: paramInputs,
    outputs: paramOutputs,
  }
}

export function irControlNode(
  nodeType: NodeType,
  execInputs: ExecPort[],
  execOutputs: ExecPort[],
  paramInputs: ParamPort[]
): IrBaseNode {
  return {
    nodeId: randomUUID(),
    nodeRole: 'CONTROL',
    nodeType: nodeType,
    execInputs: execInputs,
    execOutputs: execOutputs,
    inputs: paramInputs,
    outputs: [],
  }
}

export function irSourceNode(
  nodeType: NodeType,
  execOutputs: ExecPort[],
  paramOutputs: ParamPort[]
): IrBaseNode {
  return {
    nodeId: randomUUID(),
    nodeRole: 'SOURCE',
    nodeType: nodeType,
    execInputs: [],
    execOutputs: execOutputs,
    inputs: [],
    outputs: paramOutputs,
  }
}

export function irSinkNode(
  nodeType: NodeType,
  execInputs: ExecPort[],
  paramInputs: ParamPort[]
): IrBaseNode {
  return {
    nodeId: randomUUID(),
    nodeRole: 'SINK',
    nodeType: nodeType,
    execInputs: execInputs,
    execOutputs: [],
    inputs: paramInputs,
    outputs: [],
  }
}

export const IR_GRAPH_SERIALIZATION_MOCK: IrRelinkGraph = {
  "graphName": "TestGraph",
  "workflows": [
    {
      "workflowName": "testWorkflow1",
      "nodes": [
        {
          "nodeId": "entry",
          "outputs": [
            {
              "type": "RInt",
              "label": "x"
            },
            {
              "type": "RInt",
              "label": "y"
            }
          ],
          "nodeRole": "SOURCE",
          "nodeType": "ENTRY",
          "execInputs": [

          ],
          "execOutputs": [
            {
              "label": "exec"
            }
          ],
          "inputs": [

          ]
        },
        {
          "nodeId": "exit1",
          "inputs": [
            {
              "type": "RInt",
              "label": "z"
            }
          ],
          "nodeRole": "SINK",
          "nodeType": "EXIT",
          "execInputs": [
            {
              "label": "exec"
            }
          ],
          "execOutputs": [

          ],
          "outputs": [

          ]
        },
        {
          "nodeId": "exit2",
          "inputs": [
            {
              "type": "RInt",
              "label": "z"
            }
          ],
          "nodeRole": "SINK",
          "nodeType": "EXIT",
          "execInputs": [
            {
              "label": "exec"
            }
          ],
          "execOutputs": [

          ],
          "outputs": [

          ]
        },
        {
          "nodeId": "const1",
          "constValue": {
            "type": "RInt",
            "value": 233
          },
          "nodeRole": "SOURCE",
          "nodeType": "CONST",
          "execInputs": [

          ],
          "execOutputs": [

          ],
          "inputs": [

          ],
          "outputs": [
            {
              "type": "RInt",
              "label": "value"
            }
          ]
        },
        {
          "nodeId": "add",
          "operandType": "RInt",
          "nodeRole": "PURE",
          "nodeType": "ADD",
          "execInputs": [

          ],
          "execOutputs": [

          ],
          "inputs": [
            {
              "type": "RInt",
              "label": "x"
            },
            {
              "type": "RInt",
              "label": "y"
            }
          ],
          "outputs": [
            {
              "type": "RInt",
              "label": "z"
            }
          ]
        },
        {
          "nodeId": "mul",
          "operandType": "RInt",
          "nodeRole": "PURE",
          "nodeType": "MUL",
          "execInputs": [

          ],
          "execOutputs": [

          ],
          "inputs": [
            {
              "type": "RInt",
              "label": "x"
            },
            {
              "type": "RInt",
              "label": "y"
            }
          ],
          "outputs": [
            {
              "type": "RInt",
              "label": "z"
            }
          ]
        },
        {
          "nodeId": "gt",
          "operandType": "RInt",
          "nodeRole": "PURE",
          "nodeType": "GT",
          "execInputs": [

          ],
          "execOutputs": [

          ],
          "inputs": [
            {
              "type": "RInt",
              "label": "x"
            },
            {
              "type": "RInt",
              "label": "y"
            }
          ],
          "outputs": [
            {
              "type": "RBoolean",
              "label": "z"
            }
          ]
        },
        {
          "nodeId": "const2",
          "constValue": {
            "type": "RInt",
            "value": 0
          },
          "nodeRole": "SOURCE",
          "nodeType": "CONST",
          "execInputs": [

          ],
          "execOutputs": [

          ],
          "inputs": [

          ],
          "outputs": [
            {
              "type": "RInt",
              "label": "value"
            }
          ]
        },
        {
          "nodeId": "if",
          "nodeRole": "CONTROL",
          "nodeType": "IF",
          "execInputs": [
            {
              "label": "exec"
            }
          ],
          "execOutputs": [
            {
              "label": "true"
            },
            {
              "label": "false"
            }
          ],
          "inputs": [
            {
              "type": "RBoolean",
              "label": "condition"
            }
          ],
          "outputs": [

          ]
        }
      ],
      "portEdges": [
        {
          "from": "entry",
          "fromPort": "x",
          "to": "add",
          "toPort": "x"
        },
        {
          "from": "entry",
          "fromPort": "y",
          "to": "add",
          "toPort": "y"
        },
        {
          "from": "add",
          "fromPort": "z",
          "to": "mul",
          "toPort": "x"
        },
        {
          "from": "const1",
          "fromPort": "value",
          "to": "mul",
          "toPort": "y"
        },
        {
          "from": "mul",
          "fromPort": "z",
          "to": "gt",
          "toPort": "x"
        },
        {
          "from": "const2",
          "fromPort": "value",
          "to": "gt",
          "toPort": "y"
        },
        {
          "from": "gt",
          "fromPort": "z",
          "to": "if",
          "toPort": "condition"
        },
        {
          "from": "entry",
          "fromPort": "exec",
          "to": "if",
          "toPort": "exec"
        },
        {
          "from": "add",
          "fromPort": "z",
          "to": "exit1",
          "toPort": "z"
        },
        {
          "from": "mul",
          "fromPort": "z",
          "to": "exit2",
          "toPort": "z"
        },
        {
          "from": "if",
          "fromPort": "true",
          "to": "exit1",
          "toPort": "exec"
        },
        {
          "from": "if",
          "fromPort": "false",
          "to": "exit2",
          "toPort": "exec"
        }
      ]
    }
  ]
}