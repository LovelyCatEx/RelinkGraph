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
import {ContextMenuContainer} from "@/rete/ui/menu/ContextMenuContainer.tsx";
import {ContextMenuItem} from "@/rete/ui/menu/ContextMenuItem.tsx";
import {ContextMenuSubItem} from "@/rete/ui/menu/ContextMenuSubItem.tsx";
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
import {Button, Divider, Tooltip} from "antd";
import {ApartmentOutlined, FullscreenExitOutlined, RedoOutlined, UndoOutlined} from "@ant-design/icons";

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
          main: () => ContextMenuContainer({
            className: "p-2 rounded-[.5rem] overflow-hidden shadow-2xl min-w-[256px] " +
              "bg-[var(--background-color)] text-[var(--on-background)] border border-white/10"
          }),
          item: (item) => ContextMenuItem(item, {
            className: " flex flex-row justify-between items-center " +
              "rounded-[.25rem] pt-2 pb-2 pl-4 pr-4 " +
              "bg-[var(--background-color)] text-[var(--on-background)] group " +
              "hover:bg-[var(--primary-color-a-75)] hover:text-[var(--on-primary)] transition cursor-pointer"
          }, {
            className: " flex flex-row justify-between items-center " +
              "rounded-[.25rem] pt-2 pb-2 pl-4 pr-4 " +
              "bg-[var(--background-color)] text-[var(--on-background)] group " +
              "hover:bg-red-500/40 hover:text-white transition cursor-pointer"
          }),
          subitems: (_) => ContextMenuSubItem({
            className: "p-2 rounded-[.5rem] overflow-hidden shadow-2xl min-w-[256px] " +
              "bg-[var(--background-color)] text-[var(--on-background)] border border-white/10"
          }),
          common: () => () =>
            <div className="p-2 flex flex-row items-center space-x-2 bg-[var(--background-color)] text-[var(--on-background)]">
              <SquareFunction size="20" />
              <p>Create Node</p>
            </div>
        }
      },
      contextMenu: {
        renderDelay: 100,
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
                  [execPort('True'), execPort('False')],
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

  // Mouse Position
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!ctx) return

    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const { x, y, k } = ctx.rete.area.area.transform;

      const wx = (sx - x) / k;
      const wy = (sy - y) / k;

      setMousePos({
        x: Math.round(wx),
        y: Math.round(wy),
      });
    }

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [ctx]);

  // Area Zoom
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (!ctx) return

    const area = ctx.rete.area;

    const update = () => {
      setZoom(area.area.transform.k);
    }

    update();

    area.signal.addPipe((context) => {
      update();
      return context;
    });
  }, [ctx]);

  return (
    <div className={className} >
      <div className="w-full h-full flex-1" ref={ref} />

      {/* Top Float Tools */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex group text-[var(--secondary-color)]">
        <div className="backdrop-blur-sm rounded-lg border border-white/10 flex items-center font-mono text-[var(--primary-color)]">
          <Tooltip title="Undo">
            <Button
              type="text"
              icon={<UndoOutlined />}
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => {
                ctx?.historyUndo();
              }}
            />
          </Tooltip>

          <Tooltip title="Redo">
            <Button
              type="text"
              icon={<RedoOutlined />}
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => {
                ctx?.historyRedo();
              }}
            />
          </Tooltip>

          <Divider orientation="vertical" className="bg-white/10 h-4 mx-1" />

          <Tooltip title="Fit Viewport">
            <Button
              type="text"
              icon={<FullscreenExitOutlined />}
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => {
                ctx?.autoFitViewport();
              }}
            >
              Fit Viewport
            </Button>
          </Tooltip>

          <Divider orientation="vertical" className="bg-white/10 h-4 mx-1" />

          <Tooltip title="Arrange nodes automatically">
            <Button
              type="text"
              icon={<ApartmentOutlined />}
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => {
                ctx?.autoArrangeNodes(true);
              }}
            >
              Auto Arrange
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Bottom Float Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 group">
        <div className="backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-4 font-mono text-[var(--primary-color)] hover:bg-[var(--primary-color-a-25)] transition-all duration-100">
          <span>Position: {mousePos?.x}, {mousePos?.y}</span>
          <span>Scale: {zoom?.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  )
}