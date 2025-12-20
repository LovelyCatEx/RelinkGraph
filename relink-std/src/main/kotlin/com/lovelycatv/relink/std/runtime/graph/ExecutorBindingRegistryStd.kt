/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.graph

import com.lovelycatv.relink.ir.workflow.node.INodeType
import com.lovelycatv.relink.ir.workflow.node.IrBaseNode
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor

class ExecutorBindingRegistryStd {
  private val executors = mutableMapOf<String, NodeExecutor<*>>()

  fun <N : IrBaseNode> bind(
      nodeType: INodeType,
      executor: NodeExecutor<N>
  ) {
    executors[nodeType.getTypeName()] = executor
  }

  @Suppress("UNCHECKED_CAST")
  fun <N : IrBaseNode> executorFor(node: N): NodeExecutor<N> =
    executors[node.nodeType.getTypeName()] as NodeExecutor<N>
}