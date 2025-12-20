/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.control

import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.control.IrIfNode
import com.lovelycatv.relink.std.runtime.booleanValue
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object IfExecutor : NodeExecutor<IrIfNode> {
    override suspend fun execute(
        node: IrIfNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        return mapOf()
    }

    override suspend fun determineOutputExecs(
        node: IrIfNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): List<PortLabel> {
        val x = inputs[IrIfNode.INPUT_CONDITION]!!

        return listOf(
            if (x.booleanValue()) {
                IrIfNode.EXEC_OUTPUT_TRUE
            } else {
                IrIfNode.EXEC_OUTPUT_FALSE
            }
        )
    }
}