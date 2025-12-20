/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime

import com.lovelycatv.relink.runtime.graph.RelinkGraph
import com.lovelycatv.relink.ir.IrRelinkGraph
import com.lovelycatv.relink.std.ir.control.IrIfNode
import com.lovelycatv.relink.std.ir.pure.IrAddNode
import com.lovelycatv.relink.std.ir.pure.IrComparatorNode
import com.lovelycatv.relink.std.ir.pure.IrGTNode
import com.lovelycatv.relink.std.ir.pure.IrMulNode
import com.lovelycatv.relink.std.ir.sink.IrExitNode
import com.lovelycatv.relink.std.ir.source.IrConstantNode
import com.lovelycatv.relink.std.ir.source.IrEntryNode
import com.lovelycatv.relink.ir.type.ConstInt
import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.runtime.intValue
import com.lovelycatv.relink.std.runtime.type.IntValue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class RelinkGraphTest {
    private val graph = RelinkGraph(
        ir = IrRelinkGraph.Builder()
            .name("TestGraph")
            .addWorkflow {
                name("testWorkflow1")

                val entry = IrEntryNode(
                    "entry",
                    listOf(
                        ParamPort(RInt, "x"),
                        ParamPort(RInt, "y")
                    )
                )

                val exit1 = IrExitNode(
                    "exit1",
                    listOf(ParamPort(RInt, "z"))
                )

                val exit2 = IrExitNode(
                    "exit2",
                    listOf(ParamPort(RInt, "z"))
                )

                val nodeConstant1 = IrConstantNode(
                    "const1",
                    ConstInt(233)
                )

                val nodeAdd = IrAddNode("add", RInt)
                val nodeMul = IrMulNode("mul", RInt)

                val nodeGt = IrGTNode("gt", RInt)
                val nodeConstant2 = IrConstantNode("const2", ConstInt(0))
                val nodeIf = IrIfNode("if")

                addNode(entry)
                addNode(exit1)
                addNode(exit2)
                addNode(nodeConstant1)
                addNode(nodeAdd)
                addNode(nodeMul)
                addNode(nodeGt)
                addNode(nodeConstant2)
                addNode(nodeIf)

                makeConnection(entry.nodeId, "x", nodeAdd.nodeId, IrAddNode.INPUT_X)
                makeConnection(entry.nodeId, "y", nodeAdd.nodeId, IrAddNode.INPUT_Y)

                makeConnection(nodeAdd.nodeId, IrAddNode.OUTPUT_Z, nodeMul.nodeId, IrMulNode.INPUT_X)
                makeConnection(nodeConstant1.nodeId, IrConstantNode.OUTPUT, nodeMul.nodeId, IrMulNode.INPUT_Y)

                makeConnection(nodeMul.nodeId, IrMulNode.OUTPUT_Z, nodeGt.nodeId, IrGTNode.INPUT_X)
                makeConnection(nodeConstant2.nodeId, IrConstantNode.OUTPUT, nodeGt.nodeId, IrGTNode.INPUT_Y)

                makeConnection(nodeGt.nodeId, IrComparatorNode.OUTPUT_Z, nodeIf.nodeId, IrIfNode.INPUT_CONDITION)

                makeConnection(entry.nodeId, IrEntryNode.EXEC_OUTPUT, nodeIf.nodeId, IrIfNode.EXEC_INPUT)

                makeConnection(nodeAdd.nodeId, IrAddNode.OUTPUT_Z, exit1.nodeId, "z")
                makeConnection(nodeMul.nodeId, IrMulNode.OUTPUT_Z, exit2.nodeId, "z")

                makeConnection(nodeIf.nodeId, IrIfNode.EXEC_OUTPUT_TRUE, exit1.nodeId, IrExitNode.EXEC_INPUT)
                makeConnection(nodeIf.nodeId, IrIfNode.EXEC_OUTPUT_FALSE, exit2.nodeId, IrExitNode.EXEC_INPUT)
            }
            .build(),
        emptyMap()
    )

    @Test
    fun executeWorkflow() {
        val case1 = TestCase(1, 2, 1 + 2)
        val case2 = TestCase(1, -4, (1 - 4) * 233)
        val case3 = TestCase(-4, 2, (-4 + 2) * 233)

        runTestCase(case1)
        runTestCase(case2)
        runTestCase(case3)
    }

    private fun runTestCase(case: TestCase) {
        val result = runBlocking {
            graph.executeWorkflow(
                "testWorkflow1",
                mapOf(
                    "x" to IntValue(case.x),
                    "y" to IntValue(case.y)
                )
            )
        }

        assertEquals(case.expected, result["z"]!!.intValue())
    }

    private data class TestCase(
        val x: Int,
        val y: Int,
        val expected: Int
    )
}