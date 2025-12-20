/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.math

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.std.ir.pure.IrSubNode
import com.lovelycatv.relink.ir.type.*
import com.lovelycatv.relink.std.runtime.*
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.type.*

object SubExecutor : NodeExecutor<IrSubNode> {
    override suspend fun execute(
        node: IrSubNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        val x = inputs[IrSubNode.INPUT_X]!!
        val y = inputs[IrSubNode.INPUT_Y]!!

        val z = when (val operandType = node.operandType) {
            is RByte -> ByteValue((x.byteValue() - y.byteValue()).toByte())
            is RShort -> ShortValue((x.shortValue() - y.shortValue()).toShort())
            is RInt -> IntValue(x.intValue() - y.intValue())
            is RLong -> LongValue(x.longValue() - y.longValue())
            is RFloat -> FloatValue(x.floatValue() - y.floatValue())
            is RDouble -> DoubleValue(x.doubleValue() - y.doubleValue())
            else -> throw UnsupportedOperationException(
                "Operand type ${operandType.qualifiedName} is not supported"
            )
        }

        return mapOf(IrSubNode.OUTPUT_Z to z)
    }
}
