/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.pure.transformer

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.type.RBoolean
import com.lovelycatv.relink.ir.type.RType
import com.lovelycatv.relink.ir.workflow.node.IrPureNode
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.ir.StdNodeType

class IrToStringNode(
    nodeId: NodeId,
    val operandType: RType
) : IrPureNode(
    nodeId,
    StdNodeType.TO_STRING,
    listOf(
        ParamPort(operandType, INPUT_X)
    ),
    listOf(ParamPort(RBoolean, OUTPUT_Y))
) {
    companion object {
        const val INPUT_X = "x"
        const val OUTPUT_Y = "y"
    }
}