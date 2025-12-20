/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor.control

import com.lovelycatv.relink.std.ir.control.IrIfNode
import com.lovelycatv.relink.std.runtime.type.BooleanValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class IfExecutorTest {
    @Test
    fun determineOutputExecs() {
        val result1 = runBlocking {
            IfExecutor.determineOutputExecs(
                IrIfNode("if"),
                mapOf(
                    IrIfNode.INPUT_CONDITION to BooleanValue(true)
                )
            )[0]
        }

        assertEquals(IrIfNode.EXEC_OUTPUT_TRUE, result1)

        val result2 = runBlocking {
            IfExecutor.determineOutputExecs(
                IrIfNode("if"),
                mapOf(
                    IrIfNode.INPUT_CONDITION to BooleanValue(false)
                )
            )[0]
        }

        assertEquals(IrIfNode.EXEC_OUTPUT_FALSE, result2)

        val result3 = runBlocking {
            IfExecutor.determineOutputExecs(
                IrIfNode("if"),
                mapOf(
                    IrIfNode.INPUT_CONDITION to BooleanValue(false)
                )
            )[0]
        }

        assertEquals(IrIfNode.EXEC_OUTPUT_FALSE, result3)

        val result4 = runBlocking {
            IfExecutor.determineOutputExecs(
                IrIfNode("if"),
                mapOf(
                    IrIfNode.INPUT_CONDITION to BooleanValue(true)
                )
            )[0]
        }

        assertEquals(IrIfNode.EXEC_OUTPUT_TRUE, result4)
    }
}

