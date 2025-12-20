/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.workflow.node

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort

open class IrSinkNode(
    nodeId: NodeId,
    nodeType: INodeType,
    execInput: ExecPort,
    inputs: List<ParamPort>
) : IrBaseNode(
    nodeId,
    NodeRole.SINK,
    nodeType,
    listOf(execInput),
    listOf(),
    inputs,
    listOf()
)