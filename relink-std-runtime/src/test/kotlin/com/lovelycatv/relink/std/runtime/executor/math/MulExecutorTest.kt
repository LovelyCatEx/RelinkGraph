/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.math

import com.lovelycatv.relink.std.ir.pure.IrMulNode
import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.std.runtime.intValue
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class MulExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            MulExecutor.execute(
                IrMulNode("mul", RInt),
                mapOf(
                    IrMulNode.INPUT_X to IntValue(1),
                    IrMulNode.INPUT_Y to IntValue(0)
                )
            )[IrMulNode.OUTPUT_Z]!!
        }

        assertEquals(0, result1.intValue())

        val result2 = runBlocking {
            MulExecutor.execute(
                IrMulNode("mul", RInt),
                mapOf(
                    IrMulNode.INPUT_X to IntValue(-1),
                    IrMulNode.INPUT_Y to IntValue(0)
                )
            )[IrMulNode.OUTPUT_Z]!!
        }

        assertEquals(0, result2.intValue())

        val result3 = runBlocking {
            MulExecutor.execute(
                IrMulNode("mul", RInt),
                mapOf(
                    IrMulNode.INPUT_X to IntValue(0),
                    IrMulNode.INPUT_Y to IntValue(1)
                )
            )[IrMulNode.OUTPUT_Z]!!
        }

        assertEquals(0, result3.intValue())

        val result4 = runBlocking {
            MulExecutor.execute(
                IrMulNode("mul", RInt),
                mapOf(
                    IrMulNode.INPUT_X to IntValue(2),
                    IrMulNode.INPUT_Y to IntValue(-1)
                )
            )[IrMulNode.OUTPUT_Z]!!
        }

        assertEquals(-2, result4.intValue())
    }
}

