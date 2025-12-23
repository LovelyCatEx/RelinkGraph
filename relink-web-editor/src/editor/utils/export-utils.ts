/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import type {RelinkGraphEditorContext} from "@/editor/types";
import type {IrWorkflow} from "@/types/relink-graph.types.ts";

export function exportWorkflow(workflowName: string, ctx: RelinkGraphEditorContext): IrWorkflow {
  const nodes = ctx.rete.editor.getNodes();
  const connections = ctx.rete.editor.getConnections();

  return {
    workflowName: workflowName,
    nodes: nodes.map((node) => {
      const position = ctx.rete.area.nodeViews.get(node.id)!.position;

      return {
        ...node.node,
        position: {
          x: position.x,
          y: position.y
        }
      };
    }),
    portEdges: connections.map((conn) => {
      return {
        from: nodes.first((it) => it.id == conn.source).node.nodeId,
        fromPort: conn.sourceOutput,
        to: nodes.first((it) => it.id == conn.target).node.nodeId,
        toPort: conn.targetInput
      };
    })
  }
}