/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.sink

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.workflow.node.IrSinkNode
import com.lovelycatv.relink.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.ir.StdNodeType
import kotlinx.serialization.Serializable

@Serializable
class IrExitNode(
    nodeId: NodeId,
    inputs: List<ParamPort>,
) : IrSinkNode(
    nodeId,
    StdNodeType.EXIT,
    ExecPort(EXEC_INPUT),
    inputs
) {
    companion object {
        const val EXEC_INPUT = "exec"
    }
}