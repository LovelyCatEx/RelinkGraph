/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.source

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.workflow.node.IrSourceNode
import com.lovelycatv.relink.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.ir.StdNodeType
import kotlinx.serialization.Serializable

@Serializable
class IrEntryNode(
    nodeId: NodeId,
    outputs: List<ParamPort>
) : IrSourceNode(
    nodeId,
    StdNodeType.ENTRY,
    ExecPort(EXEC_OUTPUT),
    outputs
) {
    companion object {
        const val EXEC_OUTPUT = "exec"
    }
}