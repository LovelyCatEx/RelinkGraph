/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.comparator

import com.lovelycatv.relink.std.ir.pure.IrLTENode
import com.lovelycatv.relink.std.ir.type.RInt
import com.lovelycatv.relink.std.runtime.booleanValue
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class LTEExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            LTEExecutor.execute(
                IrLTENode("lte", RInt),
                mapOf(
                    IrLTENode.INPUT_X to IntValue(1),
                    IrLTENode.INPUT_Y to IntValue(0)
                )
            )[IrLTENode.OUTPUT_Z]!!
        }

        assertEquals(false, result1.booleanValue())

        val result2 = runBlocking {
            LTEExecutor.execute(
                IrLTENode("lte", RInt),
                mapOf(
                    IrLTENode.INPUT_X to IntValue(-1),
                    IrLTENode.INPUT_Y to IntValue(0)
                )
            )[IrLTENode.OUTPUT_Z]!!
        }

        assertEquals(true, result2.booleanValue())

        val result3 = runBlocking {
            LTEExecutor.execute(
                IrLTENode("lte", RInt),
                mapOf(
                    IrLTENode.INPUT_X to IntValue(0),
                    IrLTENode.INPUT_Y to IntValue(1)
                )
            )[IrLTENode.OUTPUT_Z]!!
        }

        assertEquals(true, result3.booleanValue())

        val result4 = runBlocking {
            LTEExecutor.execute(
                IrLTENode("lte", RInt),
                mapOf(
                    IrLTENode.INPUT_X to IntValue(0),
                    IrLTENode.INPUT_Y to IntValue(-1)
                )
            )[IrLTENode.OUTPUT_Z]!!
        }

        assertEquals(false, result4.booleanValue())
    }
}

