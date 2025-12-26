/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.comparator

import com.lovelycatv.relink.std.ir.pure.comparator.IrLTNode
import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.std.runtime.booleanValue
import com.lovelycatv.relink.std.runtime.executor.pure.comparator.LTExecutor
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class LTExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            LTExecutor.execute(
                IrLTNode("lt", RInt),
                mapOf(
                    IrLTNode.INPUT_X to IntValue(1),
                    IrLTNode.INPUT_Y to IntValue(0)
                )
            )[IrLTNode.OUTPUT_Z]!!
        }

        assertEquals(false, result1.booleanValue())

        val result2 = runBlocking {
            LTExecutor.execute(
                IrLTNode("lt", RInt),
                mapOf(
                    IrLTNode.INPUT_X to IntValue(-1),
                    IrLTNode.INPUT_Y to IntValue(0)
                )
            )[IrLTNode.OUTPUT_Z]!!
        }

        assertEquals(true, result2.booleanValue())

        val result3 = runBlocking {
            LTExecutor.execute(
                IrLTNode("lt", RInt),
                mapOf(
                    IrLTNode.INPUT_X to IntValue(0),
                    IrLTNode.INPUT_Y to IntValue(1)
                )
            )[IrLTNode.OUTPUT_Z]!!
        }

        assertEquals(true, result3.booleanValue())

        val result4 = runBlocking {
            LTExecutor.execute(
                IrLTNode("lt", RInt),
                mapOf(
                    IrLTNode.INPUT_X to IntValue(0),
                    IrLTNode.INPUT_Y to IntValue(-1)
                )
            )[IrLTNode.OUTPUT_Z]!!
        }

        assertEquals(false, result4.booleanValue())
    }
}

