/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.source

import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.std.ir.type.ConstValue
import com.lovelycatv.relink.std.ir.workflow.node.IrSourceNode
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort

class IrConstantNode(
    nodeId: NodeId,
    val constValue: ConstValue
) : IrSourceNode(
    nodeId,
    StdNodeType.CONST,
    null,
    listOf(
        ParamPort(constValue.type, OUTPUT)
    )
) {
    companion object {
        const val OUTPUT = "value"
    }
}