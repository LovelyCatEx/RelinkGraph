/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.pure.math

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.ir.type.RNumber
import com.lovelycatv.relink.ir.workflow.node.IrPureNode
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort

class IrSubNode(
    nodeId: NodeId,
    val operandType: RNumber
) : IrPureNode(
    nodeId,
    StdNodeType.SUB,
    listOf(
        ParamPort(operandType, INPUT_X),
        ParamPort(operandType, INPUT_Y)
    ),
    listOf(ParamPort(operandType, OUTPUT_Z))
) {
    companion object {
        const val INPUT_X = "x"
        const val INPUT_Y = "y"
        const val OUTPUT_Z = "z"
    }
}