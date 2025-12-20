/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.control

import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.std.ir.type.RBoolean
import com.lovelycatv.relink.std.ir.workflow.node.IrControlNode
import com.lovelycatv.relink.std.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort

class IrIfNode(
    nodeId: NodeId
) : IrControlNode(
    nodeId,
    StdNodeType.IF,
    listOf(ExecPort(EXEC_INPUT)),
    listOf(ExecPort(EXEC_OUTPUT_TRUE), ExecPort(EXEC_OUTPUT_FALSE)),
    listOf(ParamPort(RBoolean, INPUT_CONDITION))
) {
    companion object {
        const val EXEC_INPUT = "exec"
        const val INPUT_CONDITION = "condition"
        const val EXEC_OUTPUT_TRUE = "true"
        const val EXEC_OUTPUT_FALSE = "false"
    }
}