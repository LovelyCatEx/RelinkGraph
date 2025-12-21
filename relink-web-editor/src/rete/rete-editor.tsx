/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {Presets, type ReactArea2D, ReactPlugin, type RenderEmit} from "rete-react-plugin";
import {NodeEditor} from "rete";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ClassicFlow, ConnectionPlugin, getSourceTarget, type SocketData} from "rete-connection-plugin";
import {createRoot} from "react-dom/client";
import type {BaseGraphSchemes} from "./types/schemes.ts";
import type {BaseGraphSocket} from "./socket/BaseGraphSocket.ts";
import {BaseGraphNode} from "./node/BaseGraphNode.ts";
import {BaseGraphNodeConnection} from "./types/connection.ts";
import {getConnectionSockets} from "./utils/socket-utils.ts";
import {type ReactElement, useCallback} from "react";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import type {EditorContextMenuItem, GraphNodeFactory} from "@/rete/types/context-menu.ts";
import type {ItemDefinition} from "rete-context-menu-plugin/_types/presets/classic/types";
import type {ComponentType, Item} from "rete-react-plugin/_types/presets/context-menu/types";
import {ContextMenuContainer} from "@/rete/ui/menu/ContextMenuContainer.tsx";
import {ContextMenuItem} from "@/rete/ui/menu/ContextMenuItem.tsx";
import {ContextMenuSubItem} from "@/rete/ui/menu/ContextMenuSubItem.tsx";
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ArrangeAppliers
} from "rete-auto-arrange-plugin";
import {setupPanningBoundary} from "@/rete/ui/boundary";
import {
  HistoryExtensions,
  HistoryPlugin,
  Presets as HistoryPresets
} from "rete-history-plugin";

export interface GraphEditorContext<
  S extends BaseGraphSocket,
  N extends BaseGraphNode<S>,
  C extends BaseGraphNodeConnection<S, N, N>,
  SCHEMES extends BaseGraphSchemes<S, N, C>
> {
  rete: {
    editor: NodeEditor<SCHEMES>;
    area: AreaPlugin<SCHEMES, ReactArea2D<SCHEMES> | ContextMenuExtra>;
    connection: ConnectionPlugin<SCHEMES, ReactArea2D<SCHEMES> | ContextMenuExtra>;
  };
  autoFitViewport(): void;
  autoArrangeNodes(animated: boolean): Promise<void>;
  historyUndo: () => Promise<void>;
  historyRedo: () => Promise<void>;
  destroy(): void;
}

export interface CreateGraphEditorProps<
  S extends BaseGraphSocket,
  N extends BaseGraphNode<S>,
  C extends BaseGraphNodeConnection<S, N, N>,
  SCHEMES extends BaseGraphSchemes<S, N, C>
> {
  connectionFactory: (fromNode: N, fromSocket: string, toNode: N, toSocket: string) => SCHEMES["Connection"],
  render?: {
    node?: (editor: NodeEditor<SCHEMES>, node: SCHEMES["Node"], emit: RenderEmit<SCHEMES>) => ReactElement | undefined | null;
    connection?: (editor: NodeEditor<SCHEMES>, connection: SCHEMES["Connection"]) => ReactElement | undefined | null;
    socket?: (editor: NodeEditor<SCHEMES>, socket: S) => ReactElement | undefined | null;
    contextMenu?: {
      main?: () => ComponentType;
      item?: (item: Item) => ComponentType;
      subitems?: (item: Item) => ComponentType;
      common?: () => ComponentType;
    }
  },
  events?: {
    onInvalidConnection?: () => void
  },
  contextMenu?: {
    items: EditorContextMenuItem<S>[],
    renderDelay?: number
  },
  panningBoundary?: {
    enabled?: boolean,
    padding?: number,
    intensity?: number
  }
}

export function useCreateReteBaseGraphEditor<
  S extends BaseGraphSocket,
  N extends BaseGraphNode<S>,
  C extends BaseGraphNodeConnection<S, N, N>,
  SCHEMES extends BaseGraphSchemes<S, N, C>
>(props: CreateGraphEditorProps<S, N, C, SCHEMES>) {
  return useCallback(
    (container: HTMLElement) => {
      return createBaseGraphEditor(container, props);
    },
    []
  )
}

async function createBaseGraphEditor<
  S extends BaseGraphSocket,
  N extends BaseGraphNode<S>,
  C extends BaseGraphNodeConnection<S, N, N>,
  SCHEMES extends BaseGraphSchemes<S, N, C>
>(
  container: HTMLElement,
  props: CreateGraphEditorProps<S, N, C, SCHEMES>
): Promise<GraphEditorContext<S, N, C, SCHEMES>> {
  type AreaExtra = ReactArea2D<SCHEMES> | ContextMenuExtra;

  const editor = new NodeEditor<SCHEMES>();
  const area = new AreaPlugin<SCHEMES, AreaExtra>(container);
  const connection = new ConnectionPlugin<SCHEMES, AreaExtra>();
  const render = new ReactPlugin<SCHEMES, AreaExtra>({ createRoot });
  const arrange = new AutoArrangePlugin<SCHEMES>();
  const selector = AreaExtensions.selector();
  const history = new HistoryPlugin<SCHEMES>();

  AreaExtensions.selectableNodes(area, selector, {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  // Configure context menu
  const resolveContextMenu = (item: EditorContextMenuItem<S>): ItemDefinition<SCHEMES> => {
    const [key, factoryOrItems] = item;
    if (typeof factoryOrItems == 'function') {
      return [key, async () => {
        const fx = (factoryOrItems as GraphNodeFactory<S>)
        return fx() as SCHEMES["Node"];
      }]
    } else {
      return [key, (factoryOrItems as EditorContextMenuItem<S>[]).map((it) => resolveContextMenu(it))]
    }
  }

  const contextMenu = new ContextMenuPlugin<SCHEMES>({
    items: ContextMenuPresets.classic.setup(
      props.contextMenu?.items?.map((item) => resolveContextMenu(item)) ?? []
    ),
  });

  area.use(contextMenu);

  // Configure render
  render.addPreset(
    Presets.classic.setup({
      customize: {
        node(data) {
          return ({ emit }) => {
            return props.render?.node?.(editor, data.payload, emit) ?? <Presets.classic.Node data={data.payload} emit={emit} />
          }
        },
        connection(data) {
          // const { source, target } = getConnectionSockets(editor, data.payload);
          return () => {
            return props.render?.connection?.(editor, data.payload) ?? <Presets.classic.Connection data={data.payload} />
          };
        },
        socket(data) {
          return () => {
            return props.render?.socket?.(editor, data.payload as S) ?? <Presets.classic.Socket data={data.payload} />
          }
        }
      },
    })
  );

  render.addPreset(Presets.contextMenu.setup({
    customize: {
      main: () => props.render?.contextMenu?.main
        ? props.render?.contextMenu?.main?.()
        : ContextMenuContainer({
          className: "p-2 bg-white rounded-[.5rem] overflow-hidden shadow-2xl min-w-[256px]"
        }),
      item: (item) => props.render?.contextMenu?.item
        ? props.render?.contextMenu?.item?.(item)
        : ContextMenuItem(item, {
          className: " flex flex-row justify-between items-center " +
            "rounded-[.25rem] pt-2 pb-2 pl-4 pr-4 " +
            "bg-white text-black group " +
            "hover:bg-blue-500 hover:text-white transition cursor-pointer"
        }, {
          className: " flex flex-row justify-between items-center " +
            "rounded-[.25rem] pt-2 pb-2 pl-4 pr-4 " +
            "bg-white text-black group " +
            "hover:bg-red-400 hover:text-white transition cursor-pointer"
        }),
      subitems: (item) => props.render?.contextMenu?.subitems ? props.render?.contextMenu?.subitems?.(item) : ContextMenuSubItem(),
      common: () => props.render?.contextMenu?.common ? props.render?.contextMenu?.common?.() : Presets.contextMenu.Subitems
    },
    delay: props.contextMenu?.renderDelay ?? 500
  }));

  // Configure connection
  connection.addPreset(() => {
    return new ClassicFlow({
      canMakeConnection(from: SocketData, to: SocketData) {
        const [source, target] = getSourceTarget(from, to) || [null, null];

        if (!source || !target || from === to) return false;

        const sourceNode = editor.getNode(source.nodeId)!;
        const targetNode = editor.getNode(target.nodeId)!;

        const sockets = getConnectionSockets(
          editor,
          props.connectionFactory(
            sourceNode,
            source.key,
            targetNode,
            target.key
          )
        );

        if (!sockets.source!.isCompatibleWith(sockets.target!)) {
          props.events?.onInvalidConnection?.();
          connection.drop();
          return false;
        }

        const connected = editor
          .getConnections()
          .find((conn) => conn.source == sourceNode.id &&
            conn.target == targetNode.id &&
            conn.sourceOutput == source.key &&
            conn.targetInput == target.key
          ) != null;

        // Already connected before
        if (connected) {
          connection.drop();
          return false;
        }

        return Boolean(source && target);
      },
      makeConnection(from: SocketData, to: SocketData, context) {
        const [source, target] = getSourceTarget(from, to) || [null, null];
        const { editor } = context;

        if (source && target) {
          void editor.addConnection(
            props.connectionFactory(
              editor.getNode(source.nodeId)!,
              source.key,
              editor.getNode(target.nodeId)!,
              target.key
            )
          );
          return true;
        }
      }
    });
  });

  // Configure arrange
  const transitionApplier = new ArrangeAppliers.TransitionApplier<SCHEMES, never>({
    duration: 500,
    timingFunction: (t) => t,
    async onTick() {
      await AreaExtensions.zoomAt(area, editor.getNodes());
    }
  });

  arrange.addPreset(ArrangePresets.classic.setup({
    spacing: 128
  }));

  // Panning boundary
  const panningBoundary = setupPanningBoundary({
    editor,
    area,
    selector,
    padding: props?.panningBoundary?.padding ?? 120,
    intensity: (props?.panningBoundary?.enabled ?? true)
      ? (props?.panningBoundary?.intensity ?? 4)
      : 0
  });

  // Configure history plugin
  HistoryExtensions.keyboard(history);
  history.addPreset(HistoryPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);
  area.use(history);

  AreaExtensions.simpleNodesOrder(area);

  return {
    rete: {
      editor: editor,
      area: area,
      connection: connection,
    },
    autoFitViewport: () => {
      AreaExtensions.zoomAt(area, editor.getNodes())
    },
    autoArrangeNodes: async (animated: boolean) => {
      await arrange.layout({ applier: animated ? transitionApplier : undefined });
    },
    historyUndo: async () => {
      await history.undo();
    },
    historyRedo: async () => {
      await history.redo();
    },
    destroy: () => {
      area.destroy();
      panningBoundary.destroy();
    },
  };
}
