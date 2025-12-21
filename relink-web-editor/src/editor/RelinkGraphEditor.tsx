/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {useRete} from "rete-react-plugin";
import {useCreateReteBaseGraphEditor} from "@/rete/rete-editor.tsx";
import type {RelinkGraphSocket} from "@/editor/socket";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import {RelinkGraphConnection, type RelinkGraphEditorContext, type RelinkGraphSchemes} from "@/editor/types";
import * as React from "react";
import {useEffect, useState} from "react";
import {applyRelinkGraphEditirAreaBackground} from "@/editor/ui/background.ts";
import {getConnectionSockets} from "@/rete/utils/socket-utils.ts";
import {ExecSocket} from "@/editor/socket/ExecSocket.ts";
import {ExecConnectionComponent} from "@/editor/ui/connection/ExecConnection.tsx";
import {ParamConnectionComponent} from "@/editor/ui/connection/ParamConnection.tsx";
import {ParamSocket} from "@/editor/socket/ParamSocket.ts";
import {
  execPort,
  irControlNode,
  irPureNode,
  irSinkNode,
  irSourceNode,
  type IrWorkflow,
  paramPort
} from "@/types/relink-graph.types.ts";
import {ActionRelinkGraphNode} from "@/editor/node/ActionRelinkGraphNode.ts";
import {ControlRelinkGraphNode} from "@/editor/node/ControlRelinkGraphNode.ts";
import {PureRelinkGraphNode} from "@/editor/node/PureRelinkGraphNode.ts";
import {SourceRelinkGraphNode} from "@/editor/node/SourceRelinkGraphNode.ts";
import {SinkRelinkGraphNode} from "@/editor/node/SinkRelinkGraphNode.ts";
import {ActionGraphNodeComponent} from "@/editor/ui/node/ActionGraphNodeComponent.tsx";
import {ExecSocketComponent} from "@/editor/ui/socket/ExecSocket.tsx";
import {ParamSocketComponent} from "@/editor/ui/socket/ParamSocket.tsx";
import {PureGraphNodeComponent} from "@/editor/ui/node/PureGraphNodeComponent.tsx";
import {ContextMenuContainer} from "@/editor/ui/menu/ContextMenuContainer.tsx";
import {ContextMenuItem} from "@/editor/ui/menu/ContextMenuItem.tsx";
import {ContextMenuSubItem} from "@/editor/ui/menu/ContextMenuSubItem.tsx";
import {SquareFunction} from "lucide-react";
import {
  type IrAddNode,
  type IrDivNode,
  type IrEQNode,
  type IrGTENode,
  type IrGTNode,
  type IrLTENode,
  type IrLTNode,
  type IrMulNode,
  type IrSubNode,
  StdNodeType
} from "@/types/relink-graph-std.types.ts";
import {RBoolean, RInt} from "@/types/relink-ir.types.ts";

export interface RelinkGraphEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  initialWorkflow?: IrWorkflow
}

async function renderWorkflow(ctx: RelinkGraphEditorContext, ir: IrWorkflow) {
  for (const node of ir.nodes) {
    switch (node.nodeRole) {
      case "ACTION": {
        await ctx.rete.editor.addNode(
          new ActionRelinkGraphNode(node)
        )
        break;
      }
      case "CONTROL": {
        await ctx.rete.editor.addNode(
          new ControlRelinkGraphNode(node)
        )
        break;
      }
      case "PURE": {
        await ctx.rete.editor.addNode(
          new PureRelinkGraphNode(node)
        )
        break;
      }
      case "SOURCE": {
        await ctx.rete.editor.addNode(
          new SourceRelinkGraphNode(node)
        )
        break;
      }
      case "SINK": {
        await ctx.rete.editor.addNode(
          new SinkRelinkGraphNode(node)
        )
        break;
      }
    }
  }

  for (const edge of ir.portEdges) {
    const fromNode = ctx.getNodeById(edge.from)
    const toNode = ctx.getNodeById(edge.to)

    if (!fromNode || !toNode) {
      console.warn(`source or target node instance not found, source: ${edge.from}, target: ${edge.to}`)
      continue
    }

    await ctx.rete.editor.addConnection(
      new RelinkGraphConnection(fromNode, edge.fromPort, toNode, edge.toPort)
    )
  }
}

export function RelinkGraphEditor({ initialWorkflow, className }: RelinkGraphEditorProps) {
  const [ref, baseCtx] = useRete(
    useCreateReteBaseGraphEditor<
      RelinkGraphSocket,
      BaseRelinkGraphNode,
      RelinkGraphConnection,
      RelinkGraphSchemes
    >({
      connectionFactory: (
        fromNode
        , fromSocket,
        toNode,
        toSocket
      ) => {
        return new RelinkGraphConnection(fromNode, fromSocket, toNode, toSocket)
      },
      render: {
        socket(_, socket) {
          if (socket instanceof ExecSocket) {
            return <ExecSocketComponent data={socket} />;
          } else {
            return <ParamSocketComponent data={socket}/>;
          }
        },
        connection(editor, conn) {
          const { source, target } = getConnectionSockets(editor, conn);

          if (source instanceof ExecSocket || target instanceof ExecSocket) {
            return <ExecConnectionComponent data={conn} />;
          } else if (source instanceof ParamSocket || target instanceof ParamSocket) {
            return <ParamConnectionComponent data={conn} />;
          } else {
            return undefined;
          }
        },
        node(_, node, emit) {
          if (node.node.nodeRole == 'ACTION') {
            return <ActionGraphNodeComponent data={node} emit={emit} />;
          } else if (node.node.nodeRole == 'PURE') {
            return <PureGraphNodeComponent data={node} emit={emit} />;
          } else if (node.node.nodeRole == 'SOURCE') {
            return <ActionGraphNodeComponent data={node} emit={emit} />;
          } else if (node.node.nodeRole == 'SINK') {
            return <ActionGraphNodeComponent data={node} emit={emit} />;
          } else if (node.node.nodeRole == 'CONTROL') {
            return <ActionGraphNodeComponent data={node} emit={emit} />;
          } else {
            return undefined;
          }
        },
        contextMenu: {
          main: () => ContextMenuContainer(),
          item: (item) => ContextMenuItem(item),
          subitems: (_) => ContextMenuSubItem(),
          common: () => () =>
            <div className="p-2 flex flex-row items-center space-x-2">
              <SquareFunction size="20" />
              <p>Create Node</p>
            </div>
        }
      },
      contextMenu: {
        items: [
          ['Entry', () => new SourceRelinkGraphNode(irSourceNode(StdNodeType.ENTRY, [execPort()], []))],
          ['Exit', () => new SinkRelinkGraphNode(irSinkNode(StdNodeType.EXIT, [execPort()], []))],
          ['Math', [
            ['Add(x, y)', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.ADD,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RInt, 'z')]
              ),
              operandType: RInt
            } as IrAddNode)
            ],
            ['Subtract(x, y)', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.SUB,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RInt, 'z')]
              ),
              operandType: RInt
            } as IrSubNode)
            ],
            ['Multiply(x, y)', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.MUL,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RInt, 'z')]
              ),
              operandType: RInt
            } as IrMulNode)
            ],
            ['Divide(x, y)', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.DIV,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RInt, 'z')]
              ),
              operandType: RInt
            } as IrDivNode)
            ],
          ]],
          ['Control', [
            ['If', () => new ControlRelinkGraphNode(
                irControlNode(
                  StdNodeType.IF,
                  [execPort()],
                  [execPort()],
                  [paramPort(RInt, 'condition')]
                )
              )
            ],
          ]],
          ['Comparator', [
            ['=', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.EQ,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RBoolean, 'z')]
              ),
              operandType: RInt
            } as IrEQNode)
            ],
            ['>', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.GT,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RBoolean, 'z')]
              ),
              operandType: RInt
            } as IrGTNode)
            ],
            ['>=', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.GTE,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RBoolean, 'z')]
              ),
              operandType: RInt
            } as IrGTENode)
            ],
            ['<', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.LT,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RBoolean, 'z')]
              ),
              operandType: RInt
            } as IrLTNode)
            ],
            ['<=', () => new PureRelinkGraphNode({
              ...irPureNode(
                StdNodeType.LTE,
                [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
                [paramPort(RBoolean, 'z')]
              ),
              operandType: RInt
            } as IrLTENode)
            ],
          ]]
        ]
      }
    })
  );
  const [ctx, setCtx] = useState<RelinkGraphEditorContext | null>(null);

  useEffect(() => {
    if (!baseCtx) return;

    setCtx({
      ...baseCtx,
      getNodeById: (nodeId) => {
        return baseCtx.rete.editor
          .getNodes()
          .find((it) => it.node.nodeId == nodeId)
      }
    });
  }, [baseCtx]);

  useEffect(() => {
    if (!ctx) return;

    if (initialWorkflow) {
      renderWorkflow(ctx, initialWorkflow)
        .then()
        .catch(err => {
          console.error(`graph render failed, workflow: ${initialWorkflow.workflowName}`, err);
        });
    }

    applyRelinkGraphEditirAreaBackground(ctx.rete.area);
  }, [ctx]);

  return (
    <div className={className} ref={ref} />
  )
}