/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import type {BaseGraphNode} from "@/rete/node/BaseGraphNode.ts";
import type {BaseGraphSocket} from "@/rete/socket/BaseGraphSocket.ts";

export type GraphNodeFactory<S extends BaseGraphSocket> = () => (BaseGraphNode<S> | Promise<BaseGraphNode<S>>)

export type EditorContextMenuItem<S extends BaseGraphSocket> = [
  string, GraphNodeFactory<S> | EditorContextMenuItem<S>[]
];
