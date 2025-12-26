/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.pure.transformer

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.ir.type.*
import com.lovelycatv.relink.std.ir.pure.transformer.IrToStringNode
import com.lovelycatv.relink.std.runtime.*
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object ToStringExecutor : NodeExecutor<IrToStringNode> {
    override suspend fun execute(
        node: IrToStringNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        val x = inputs[IrToStringNode.INPUT_X]!!

        val y = when (val operandType = node.operandType) {
            is RChar -> x.charValue().toString().asRuntimeValue()
            is RByte -> x.byteValue().toString().asRuntimeValue()
            is RBoolean -> x.booleanValue().toString().asRuntimeValue()
            is RShort -> x.shortValue().toString().asRuntimeValue()
            is RInt -> x.intValue().toString().asRuntimeValue()
            is RLong -> x.longValue().toString().asRuntimeValue()
            is RFloat -> x.floatValue().toString().asRuntimeValue()
            is RDouble -> x.doubleValue().toString().asRuntimeValue()
            else -> {
                throw UnsupportedOperationException(
                    "Operand type ${operandType.qualifiedName} is not supported"
                )
            }
        }

        return mapOf(IrToStringNode.OUTPUT_Y to y)
    }
}
