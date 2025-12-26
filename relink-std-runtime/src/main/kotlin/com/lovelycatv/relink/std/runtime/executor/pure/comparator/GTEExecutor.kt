/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.pure.comparator

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.std.ir.pure.comparator.IrGTENode
import com.lovelycatv.relink.std.runtime.asRuntimeValue
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.intValue
import com.lovelycatv.relink.std.runtime.type.ComparableValue
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object GTEExecutor : NodeExecutor<IrGTENode> {
    override suspend fun execute(
        node: IrGTENode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        val x = inputs[IrGTENode.INPUT_X]!! as ComparableValue
        val y = inputs[IrGTENode.INPUT_Y]!! as ComparableValue

        val z = x.compareTo(y).intValue() >= 0

        return mapOf(
            IrGTENode.OUTPUT_Z to z.asRuntimeValue()
        )
    }
}
