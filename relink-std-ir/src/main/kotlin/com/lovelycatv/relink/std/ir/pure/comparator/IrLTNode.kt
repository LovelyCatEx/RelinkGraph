/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.pure.comparator

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.ir.type.RBoolean
import com.lovelycatv.relink.ir.type.RComparable
import com.lovelycatv.relink.ir.workflow.node.IrPureNode
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort

class IrLTNode(
    nodeId: NodeId,
    val operandType: RComparable
) : IrPureNode(
    nodeId,
    StdNodeType.LT,
    listOf(
        ParamPort(operandType, INPUT_X),
        ParamPort(operandType, INPUT_Y)
    ),
    listOf(ParamPort(RBoolean, OUTPUT_Z))
) {
    companion object {
        const val INPUT_X = "x"
        const val INPUT_Y = "y"
        const val OUTPUT_Z = "z"
    }
}
