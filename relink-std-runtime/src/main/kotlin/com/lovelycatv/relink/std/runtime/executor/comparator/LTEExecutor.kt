/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.comparator

import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.pure.IrLTENode
import com.lovelycatv.relink.std.runtime.asRuntimeValue
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.intValue
import com.lovelycatv.relink.std.runtime.type.ComparableValue
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object LTEExecutor : NodeExecutor<IrLTENode> {
    override suspend fun execute(
        node: IrLTENode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        val x = inputs[IrLTENode.INPUT_X]!! as ComparableValue
        val y = inputs[IrLTENode.INPUT_Y]!! as ComparableValue

        val z = x.compareTo(y).intValue() <= 0

        return mapOf(
            IrLTENode.OUTPUT_Z to z.asRuntimeValue()
        )
    }
}
