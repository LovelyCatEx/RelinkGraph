/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.workflow.node

import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort

abstract class IrBaseNode(
    val nodeId: NodeId,
    val nodeRole: NodeRole,
    val nodeType: INodeType,
    val execInputs: List<ExecPort>,
    val execOutputs: List<ExecPort>,
    val inputs: List<ParamPort>,
    val outputs: List<ParamPort>
) {
    init {
        (execInputs + inputs).map { it.label }.run {
            if (this.toSet().size != this.size) {
                throw IllegalArgumentException("Duplicate input port label definitions")
            }
        }

        (execOutputs + outputs).map { it.label }.run {
            if (this.toSet().size != this.size) {
                throw IllegalArgumentException("Duplicate output port label definitions")
            }
        }
    }
}