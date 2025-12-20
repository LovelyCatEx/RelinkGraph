/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.math

import com.lovelycatv.relink.std.ir.pure.IrSubNode
import com.lovelycatv.relink.std.ir.type.RInt
import com.lovelycatv.relink.std.runtime.intValue
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class SubExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            SubExecutor.execute(
                IrSubNode("sub", RInt),
                mapOf(
                    IrSubNode.INPUT_X to IntValue(1),
                    IrSubNode.INPUT_Y to IntValue(0)
                )
            )[IrSubNode.OUTPUT_Z]!!
        }

        assertEquals(1, result1.intValue())

        val result2 = runBlocking {
            SubExecutor.execute(
                IrSubNode("sub", RInt),
                mapOf(
                    IrSubNode.INPUT_X to IntValue(-1),
                    IrSubNode.INPUT_Y to IntValue(0)
                )
            )[IrSubNode.OUTPUT_Z]!!
        }

        assertEquals(-1, result2.intValue())

        val result3 = runBlocking {
            SubExecutor.execute(
                IrSubNode("sub", RInt),
                mapOf(
                    IrSubNode.INPUT_X to IntValue(0),
                    IrSubNode.INPUT_Y to IntValue(1)
                )
            )[IrSubNode.OUTPUT_Z]!!
        }

        assertEquals(-1, result3.intValue())

        val result4 = runBlocking {
            SubExecutor.execute(
                IrSubNode("sub", RInt),
                mapOf(
                    IrSubNode.INPUT_X to IntValue(0),
                    IrSubNode.INPUT_Y to IntValue(-1)
                )
            )[IrSubNode.OUTPUT_Z]!!
        }

        assertEquals(1, result4.intValue())
    }
}

