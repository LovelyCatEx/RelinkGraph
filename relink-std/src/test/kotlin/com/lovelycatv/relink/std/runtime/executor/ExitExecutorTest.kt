/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor

import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.std.intValue
import com.lovelycatv.relink.std.ir.sink.IrExitNode
import com.lovelycatv.relink.std.runtime.type.IntValue
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ExitExecutorTest {
    @Test
    fun execute() {
        val node = IrExitNode("exit", listOf(ParamPort(RInt, "x")))

        val result1 = runBlocking {
            ExitExecutor.execute(
                node,
                mapOf("x" to IntValue(1))
            )["x"]!!
        }

        assertEquals(1, result1.intValue())

        val result2 = runBlocking {
            ExitExecutor.execute(
                node,
                mapOf("x" to IntValue(-1))
            )["x"]!!
        }

        assertEquals(-1, result2.intValue())

        val result3 = runBlocking {
            ExitExecutor.execute(
                node,
                mapOf("x" to IntValue(0))
            )["x"]!!
        }

        assertEquals(0, result3.intValue())

        val result4 = runBlocking {
            ExitExecutor.execute(
                node,
                mapOf("x" to IntValue(42))
            )["x"]!!
        }

        assertEquals(42, result4.intValue())
    }
}

