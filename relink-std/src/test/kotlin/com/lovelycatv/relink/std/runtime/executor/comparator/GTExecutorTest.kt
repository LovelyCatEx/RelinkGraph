/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.comparator

import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.std.booleanValue
import com.lovelycatv.relink.std.ir.pure.IrGTNode
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class GTExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            GTExecutor.execute(
                IrGTNode("gt", RInt),
                mapOf(
                    IrGTNode.INPUT_X to IntValue(1),
                    IrGTNode.INPUT_Y to IntValue(0)
                )
            )[IrGTNode.OUTPUT_Z]!!
        }

        assertEquals(true, result1.booleanValue())

        val result2 = runBlocking {
            GTExecutor.execute(
                IrGTNode("gt", RInt),
                mapOf(
                    IrGTNode.INPUT_X to IntValue(-1),
                    IrGTNode.INPUT_Y to IntValue(0)
                )
            )[IrGTNode.OUTPUT_Z]!!
        }

        assertEquals(false, result2.booleanValue())

        val result3 = runBlocking {
            GTExecutor.execute(
                IrGTNode("gt", RInt),
                mapOf(
                    IrGTNode.INPUT_X to IntValue(0),
                    IrGTNode.INPUT_Y to IntValue(1)
                )
            )[IrGTNode.OUTPUT_Z]!!
        }

        assertEquals(false, result3.booleanValue())

        val result4 = runBlocking {
            GTExecutor.execute(
                IrGTNode("gt", RInt),
                mapOf(
                    IrGTNode.INPUT_X to IntValue(0),
                    IrGTNode.INPUT_Y to IntValue(-1)
                )
            )[IrGTNode.OUTPUT_Z]!!
        }

        assertEquals(true, result4.booleanValue())
    }
}