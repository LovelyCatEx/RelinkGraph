/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor

import com.lovelycatv.relink.std.ir.source.IrConstantNode
import com.lovelycatv.relink.ir.type.ConstInt
import com.lovelycatv.relink.std.runtime.executor.source.ConstExecutor
import com.lovelycatv.relink.std.runtime.intValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ConstExecutorTest {
    @Test
    fun execute() {
        val result1 = runBlocking {
            ConstExecutor.execute(
                IrConstantNode("const", ConstInt(1)),
                mapOf()
            )[IrConstantNode.OUTPUT]!!
        }

        assertEquals(1, result1.intValue())

        val result2 = runBlocking {
            ConstExecutor.execute(
                IrConstantNode("const", ConstInt(-1)),
                mapOf()
            )[IrConstantNode.OUTPUT]!!
        }

        assertEquals(-1, result2.intValue())

        val result3 = runBlocking {
            ConstExecutor.execute(
                IrConstantNode("const", ConstInt(0)),
                mapOf()
            )[IrConstantNode.OUTPUT]!!
        }

        assertEquals(0, result3.intValue())

        val result4 = runBlocking {
            ConstExecutor.execute(
                IrConstantNode("const", ConstInt(42)),
                mapOf()
            )[IrConstantNode.OUTPUT]!!
        }

        assertEquals(42, result4.intValue())
    }
}

