/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {useRete} from "rete-react-plugin";
import {type CreateGraphEditorPropsEvents, useCreateReteBaseGraphEditor} from "@/rete/rete-editor.tsx";
import type {RelinkGraphSocket} from "@/editor/socket";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import {RelinkGraphConnection, type RelinkGraphEditorContext, type RelinkGraphSchemes} from "@/editor/types";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {applyRelinkGraphEditirAreaBackground} from "@/editor/ui/background.ts";
import {getConnectionSockets} from "@/rete/utils/socket-utils.ts";
import {ExecSocket} from "@/editor/socket/ExecSocket.ts";
import {ExecConnectionComponent} from "@/editor/ui/connection/ExecConnection.tsx";
import {ParamConnectionComponent} from "@/editor/ui/connection/ParamConnection.tsx";
import {ParamSocket} from "@/editor/socket/ParamSocket.ts";
import {
  type ExecPort,
  execPort,
  irControlNode,
  type IrPortEdge,
  irPureNode,
  irSinkNode,
  type IrWorkflow,
  type NodeId,
  type NodeType,
  type ParamPort,
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
  irConstNode,
  type IrConstNode,
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
import {
  getRType,
  RBoolean,
  RByte,
  RChar,
  RDouble,
  RFloat,
  RInt,
  RLong,
  RShort,
  RString, rTypeInstanceOf
} from "@/types/relink-ir.types.ts";
import {Button, Divider, Tooltip} from "antd";
import {ApartmentOutlined, FullscreenExitOutlined, LockOutlined, RedoOutlined, UndoOutlined} from "@ant-design/icons";
import {NotificationContext} from "@/main.tsx";
import {ControlGraphNodeComponent} from "@/editor/ui/node/ControlGraphNodeComponent.tsx";
import {SinkGraphNodeComponent} from "@/editor/ui/node/SinkGraphNodeComponent.tsx";
import {SourceGraphNodeComponent} from "@/editor/ui/node/SourceGraphNodeComponent.tsx";
import {BaseRelinkGraphNodeControl} from "@/editor/control/BaseRelinkGraphNodeControl.ts";
import {ConstantInputControlComponent} from "@/editor/ui/control/ConstantInputControlComponent.tsx";
import {stringToRealType} from "@/utils/types.ts";

// @ts-ignore
function openContextMenuAt(
  areaEl: HTMLElement,
  x: number,
  y: number
) {
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  })

  areaEl.dispatchEvent(event)
}

// @ts-ignore
function worldToScreen(
  area: any,
  wx: number,
  wy: number
) {
  const { x, y, k } = area.transform
  return {
    x: wx * k + x,
    y: wy * k + y,
  }
}


export interface RelinkGraphEditorProps extends
  React.HTMLAttributes<HTMLDivElement>,
  CreateGraphEditorPropsEvents<RelinkGraphSocket, BaseRelinkGraphNodeControl, BaseRelinkGraphNode, RelinkGraphConnection>
{
  initialWorkflow?: IrWorkflow;
  onEditorInitialized?: (ctx: RelinkGraphEditorContext) => void;
  onInitialRendered?: () => void;
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
          new SourceRelinkGraphNode(node, undefined)
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

export function RelinkGraphEditor(props: RelinkGraphEditorProps) {
  const notification = useContext(NotificationContext);

  const { initialWorkflow, className, onEditorInitialized } = props;

  const [isEditorReadonly, setEditorReadonly] = useState<boolean>(false);

  const [ctx, setCtx] = useState<RelinkGraphEditorContext | null>(null);

  const generateNewNodeName = (nodes: BaseRelinkGraphNode[], nodeType: NodeType) => {
    let count = 1;
    const mapping = nodes.associateBy((node) => node.node.nodeId);

    let expectedName = `${nodeType.toLowerCase()} ${count}`;
    while (mapping.has(expectedName)) {
      count++;
      expectedName = `${nodeType.toLowerCase()} ${count}`;
    }

    return expectedName;
  }

  const [ref, baseCtx] = useRete(
    useCreateReteBaseGraphEditor<
      RelinkGraphSocket,
    BaseRelinkGraphNodeControl,
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
      canMakeConnection: (fromNode, s, fromLabel, toNode, t, toLabel) => {
        const fromPort = fromNode.findOutputSocket(fromLabel) as ExecPort | ParamPort;
        const toPort = toNode.findInputSocket(toLabel) as ExecPort | ParamPort;

        if (!s.isCompatibleWith(t)) {
          return false;
        }

        if (!fromPort || !toPort) {
          notification?.['warning']?.({
            title: 'Connection',
            description: `Could not find port of source or target node when connecting ${fromNode.node.nodeId} [${fromLabel}] to ${toNode.node.nodeId} [${toLabel}]`,
          })
          return false;
        }

        // Fix: only ParamPort owns type property
        if ((fromPort as ParamPort).type && (toPort as ParamPort).type) {
          if (!getRType((toPort as ParamPort).type).isAssignableFrom(getRType((fromPort as ParamPort).type))) {
            notification?.['warning']?.({
              title: 'Connection',
              description: `Incapable type, cannot cast type ${(fromPort as ParamPort).type} to type ${(toPort as ParamPort).type}`,
            })
            return false;
          }
        }

        return true;
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
            return <SourceGraphNodeComponent data={node} emit={emit} />;
          } else if (node.node.nodeRole == 'SINK') {
            return <SinkGraphNodeComponent data={node} emit={emit} />;
          } else if (node.node.nodeRole == 'CONTROL') {
            return <ControlGraphNodeComponent data={node} emit={emit} />;
          } else {
            return undefined;
          }
        },
        control(_, control) {
          if (control.node.node.nodeType == StdNodeType.CONST) {
            return <ConstantInputControlComponent
              onValuedChanged={(v) => {
                const type = getRType((control.node.node as IrConstNode).constValue.type);
                let realValue = v;
                if (rTypeInstanceOf(type, RString)) {
                  (control.node.node as IrConstNode).constValue.value = realValue;
                } else {
                  (control.node.node as IrConstNode).constValue.value = stringToRealType(realValue);
                }
              }}
              node={control.node}
              portLabel={control.portLabel}
              id={control.id}
            />
          } else {
            return <span>*</span>;
          }
        },
        contextMenu: {
          main: () => ContextMenuContainer({
            className: "p-2 rounded-[.5rem] shadow-2xl min-w-[256px] " +
              "bg-transparent text-[var(--on-background)] border border-white/10 backdrop-blur-md"
          }),
          item: (item) => ContextMenuItem(item, {
            className: " flex flex-row justify-between items-center " +
              "rounded-[.25rem] pt-2 pb-2 pl-4 pr-4 " +
              "bg-transparent text-[var(--on-background)] group " +
              "hover:bg-[var(--primary-color-a-75)] hover:text-[var(--on-primary)] transition cursor-pointer"
          }, {
            className: " flex flex-row justify-between items-center " +
              "rounded-[.25rem] pt-2 pb-2 pl-4 pr-4 " +
              "bg-transparent text-[var(--on-background)] group " +
              "hover:bg-red-500/40 hover:text-white transition cursor-pointer"
          }),
          // CSS Styles should be same with main
          subitems: (_) => ContextMenuSubItem({
            className: "p-2 rounded-[.5rem] shadow-2xl min-w-[256px] " +
              "bg-[var(--background-color)] text-[var(--on-background)] border border-white/10"
          }),
          common: () => () =>
            <div className="p-2 flex flex-row items-center space-x-2 bg-transparent text-[var(--on-background)]">
              <SquareFunction size="20" />
              <p>Create Node</p>
            </div>
        }
      },
      contextMenu: {
        renderDelay: 100,
      },
      events: props,
    })
  );

  useEffect(() => {
    if (!baseCtx) return;

    const getNodeById = (nodeId: NodeId) => {
      return baseCtx.rete.editor
        .getNodes()
        .find((it) => it.node.nodeId == nodeId)
    }

    const getConnectionByEdge = (edge: IrPortEdge) => {
      const fromNode = getNodeById(edge.from);
      const toNode = getNodeById(edge.to);

      if (!fromNode || !toNode) {
        return undefined;
      }

      return baseCtx.rete.editor
        .getConnections()
        .find((conn) => {
          return conn.source == fromNode.id && conn.target == toNode.id;
        });
    }

    const deleteNodeById = async (nodeId: NodeId) => {
      const node = getNodeById(nodeId);
      if (!node) return undefined;

      await baseCtx.rete.editor.removeNode(node.id);

      // Get associated connections
      const connections = baseCtx.rete.editor
        .getConnections()
        .filter((conn) => conn.source == node.id || conn.target == node.id);

      // Delete associated connections
      for (const conn of connections) {
        await baseCtx.rete.editor.removeConnection(conn.id);
      }

      return node;
    }

    const deleteConnectionByEdge = async (edge: IrPortEdge) => {
      const e = getConnectionByEdge(edge);
      if (!e) return undefined;
      await baseCtx.rete.editor.removeConnection(e.id);
      return e;
    }

    const integratedCtx: RelinkGraphEditorContext = {
      ...baseCtx,
      enableReadonly: () => {
        setEditorReadonly(true);
        baseCtx.enableReadonly();
      },
      disableReadonly: () => {
        setEditorReadonly(false);
        baseCtx.disableReadonly();
      },
      getNodeById: getNodeById,
      getConnectionByEdge: getConnectionByEdge,
      deleteNodeById: deleteNodeById,
      deleteConnectionByEdge: deleteConnectionByEdge,
      generateNewNodeName: (nodeType) => {
        return generateNewNodeName(baseCtx.rete.editor.getNodes(), nodeType);
      },
      hasEntryNode: () => {
        return baseCtx.rete.editor
          .getNodes()
          .first((it) => it.node.nodeType == StdNodeType.ENTRY) as SourceRelinkGraphNode;
      }
    };

    setCtx(integratedCtx);

    // Register context menu
    integratedCtx.registerContextMenu(
      [
        ['Exit', () => new SinkRelinkGraphNode(irSinkNode(StdNodeType.EXIT, [execPort()], [], integratedCtx.generateNewNodeName(StdNodeType.EXIT)))],
        ['Constant', [
          ['Boolean', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RBoolean,
                false,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Int', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RInt,
                0,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['String', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RString,
                '',
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Float', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RFloat,
                0.0,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Double', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RDouble,
                0.0,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Long', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RLong,
                0,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Short', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RShort,
                0,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Char', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RChar,
                '',
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ],
          ['Byte', () =>
            new SourceRelinkGraphNode(
              irConstNode(
                RByte,
                0,
                integratedCtx.generateNewNodeName(StdNodeType.CONST)
              )
            )
          ]
        ]],
        ['Math', [
          ['Add(x, y)', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.ADD,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RInt, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.ADD)
            ),
            operandType: RInt
          } as IrAddNode)
          ],
          ['Subtract(x, y)', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.SUB,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RInt, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.SUB)
            ),
            operandType: RInt
          } as IrSubNode)
          ],
          ['Multiply(x, y)', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.MUL,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RInt, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.MUL)
            ),
            operandType: RInt
          } as IrMulNode)
          ],
          ['Divide(x, y)', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.DIV,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RInt, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.DIV)
            ),
            operandType: RInt
          } as IrDivNode)
          ],
        ]],
        ['Control', [
          ['If Else', () => new ControlRelinkGraphNode(
            irControlNode(
              StdNodeType.IF,
              [execPort()],
              [execPort('True'), execPort('False')],
              [paramPort(RBoolean, 'condition')],
              integratedCtx.generateNewNodeName(StdNodeType.IF)
            )
          )
          ],
        ]],
        ['Comparator', [
          ['=', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.EQ,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RBoolean, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.EQ)
            ),
            operandType: RInt
          } as IrEQNode)
          ],
          ['>', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.GT,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RBoolean, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.GT)
            ),
            operandType: RInt
          } as IrGTNode)
          ],
          ['>=', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.GTE,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RBoolean, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.GTE)
            ),
            operandType: RInt
          } as IrGTENode)
          ],
          ['<', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.LT,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RBoolean, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.LT)
            ),
            operandType: RInt
          } as IrLTNode)
          ],
          ['<=', () => new PureRelinkGraphNode({
            ...irPureNode(
              StdNodeType.LTE,
              [paramPort(RInt, 'x'), paramPort(RInt, 'y')],
              [paramPort(RBoolean, 'z')],
              integratedCtx.generateNewNodeName(StdNodeType.LTE)
            ),
            operandType: RInt
          } as IrLTENode)
          ],
        ]]
      ]
    );

    onEditorInitialized?.(integratedCtx);
  }, [baseCtx]);

  useEffect(() => {
    if (!ctx) return;

    if (initialWorkflow) {
      renderWorkflow(ctx, initialWorkflow)
        .then(() => {
          if (props.onInitialRendered) {
            props.onInitialRendered()
          } else {
            ctx.autoFitViewport();
          }
        })
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

  const onReadonlyRejectedEvent = () => {
    notification?.['warning']?.({
      title: 'Readonly Editor',
      description: 'Cannot edit the graph when editor in readonly mode',
    });
  }

  return (
    <div className={className} >
      <div className="w-full h-full flex-1 cursor-default active:cursor-grabbing" ref={ref} />

      {/* Top Float Tools */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex group text-[var(--secondary-color)]">
        <div className="backdrop-blur-sm rounded-lg border border-white/10 flex items-center font-mono text-[var(--primary-color)]">
          <Tooltip title="Undo (CTRL+Z)" placement="bottom">
            <Button
              type="text"
              icon={<UndoOutlined />}
              onClick={() => {
                if (isEditorReadonly) {
                  onReadonlyRejectedEvent();
                  return;
                }
                ctx?.historyUndo();
              }}
            />
          </Tooltip>

          <Tooltip title="Redo (CTRL+Y)" placement="bottom">
            <Button
              type="text"
              icon={<RedoOutlined />}
              onClick={() => {
                if (isEditorReadonly) {
                  onReadonlyRejectedEvent();
                  return;
                }
                ctx?.historyRedo();
              }}
            />
          </Tooltip>

          <Divider orientation="vertical" className="bg-white/10 h-4 mx-1" />

          <Tooltip title="Fit Viewport" placement="bottom">
            <Button
              type="text"
              icon={<FullscreenExitOutlined />}
              onClick={() => {
                ctx?.autoFitViewport();
              }}
            >
              Fit Viewport
            </Button>
          </Tooltip>

          <Divider orientation="vertical" className="bg-white/10 h-4 mx-1" />

          <Tooltip title="Arrange nodes automatically" placement="bottom">
            <Button
              type="text"
              icon={<ApartmentOutlined />}
              onClick={() => {
                if (isEditorReadonly) {
                  onReadonlyRejectedEvent();
                  return;
                }
                ctx?.autoArrangeNodes(true);
              }}
            >
              Auto Arrange
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Top-Right Floating Content */}
      <div className="absolute right-4 top-4">
        {isEditorReadonly && (
          <div className="backdrop-blur-sm rounded-lg border border-white/10 flex items-center font-mono text-[var(--primary-color)]">
            <Tooltip title="The editor is in readonly mode" placement="bottom">
              <Button
                type="text"
                icon={<LockOutlined />}
              >
                Readonly
              </Button>
            </Tooltip>
          </div>
        )}
      </div>


      {/* Bottom Float Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 group">
        <div className="backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-4 font-mono text-[var(--primary-color)] hover:bg-[var(--primary-color-a-25)] transition-all duration-100">
          <span>Position: {mousePos?.x ?? '0'}, {mousePos?.y ?? '0'}</span>
          <span>Scale: {zoom?.toFixed(2) ?? '1'}x</span>
        </div>
      </div>

     </div>
  )
}