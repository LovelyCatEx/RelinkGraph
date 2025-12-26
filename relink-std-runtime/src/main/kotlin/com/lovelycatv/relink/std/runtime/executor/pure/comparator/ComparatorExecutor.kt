/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.pure.comparator

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.std.ir.pure.comparator.IrComparatorNode
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.type.ComparableValue
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object ComparatorExecutor : NodeExecutor<IrComparatorNode> {
    override suspend fun execute(
        node: IrComparatorNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        val x = inputs[IrComparatorNode.INPUT_X]!! as ComparableValue
        val y = inputs[IrComparatorNode.INPUT_Y]!! as ComparableValue

        val z = x.compareTo(y)

        return mapOf(
            IrComparatorNode.OUTPUT_Z to z
        )
    }
}