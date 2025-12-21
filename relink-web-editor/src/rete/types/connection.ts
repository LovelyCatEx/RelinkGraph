/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {ClassicPreset} from "rete";
import type {BaseGraphNode} from "../node/BaseGraphNode.ts";
import type {BaseGraphSocket} from "../socket/BaseGraphSocket.ts";

export class BaseGraphNodeConnection<
  S extends BaseGraphSocket,
  A extends BaseGraphNode<S>,
  B extends BaseGraphNode<S>
> extends ClassicPreset.Connection<A, B> {}