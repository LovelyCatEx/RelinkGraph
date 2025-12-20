/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.comparator

import com.lovelycatv.relink.std.ir.pure.IrComparatorNode
import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.std.runtime.intValue
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ComparatorExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            ComparatorExecutor.execute(
                IrComparatorNode("comparator", RInt),
                mapOf(
                    IrComparatorNode.INPUT_X to IntValue(1),
                    IrComparatorNode.INPUT_Y to IntValue(0)
                )
            )[IrComparatorNode.OUTPUT_Z]!!
        }

        assertEquals(1, result1.intValue())

        val result2 = runBlocking {
            ComparatorExecutor.execute(
                IrComparatorNode("comparator", RInt),
                mapOf(
                    IrComparatorNode.INPUT_X to IntValue(-1),
                    IrComparatorNode.INPUT_Y to IntValue(0)
                )
            )[IrComparatorNode.OUTPUT_Z]!!
        }

        assertEquals(-1, result2.intValue())

        val result3 = runBlocking {
            ComparatorExecutor.execute(
                IrComparatorNode("comparator", RInt),
                mapOf(
                    IrComparatorNode.INPUT_X to IntValue(0),
                    IrComparatorNode.INPUT_Y to IntValue(1)
                )
            )[IrComparatorNode.OUTPUT_Z]!!
        }

        assertEquals(-1, result3.intValue())

        val result4 = runBlocking {
            ComparatorExecutor.execute(
                IrComparatorNode("comparator", RInt),
                mapOf(
                    IrComparatorNode.INPUT_X to IntValue(0),
                    IrComparatorNode.INPUT_Y to IntValue(-1)
                )
            )[IrComparatorNode.OUTPUT_Z]!!
        }

        assertEquals(1, result4.intValue())
    }
}

