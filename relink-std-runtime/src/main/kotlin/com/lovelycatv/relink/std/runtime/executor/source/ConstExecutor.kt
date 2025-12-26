/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.source

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.std.ir.source.IrConstantNode
import com.lovelycatv.relink.std.runtime.asRuntimeValue
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object ConstExecutor : NodeExecutor<IrConstantNode> {
    override suspend fun execute(
        node: IrConstantNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        return mapOf(
            IrConstantNode.Companion.OUTPUT to node.constValue.asRuntimeValue()
        )
    }
}