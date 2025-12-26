/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.graph

import com.lovelycatv.relink.ir.IrRelinkGraph
import com.lovelycatv.relink.std.ir.control.IrIfNode
import com.lovelycatv.relink.std.ir.pure.math.IrAddNode
import com.lovelycatv.relink.std.ir.pure.comparator.IrComparatorNode
import com.lovelycatv.relink.std.ir.pure.comparator.IrGTNode
import com.lovelycatv.relink.std.ir.pure.math.IrMulNode
import com.lovelycatv.relink.std.ir.sink.IrExitNode
import com.lovelycatv.relink.std.ir.source.IrConstantNode
import com.lovelycatv.relink.std.ir.source.IrEntryNode
import com.lovelycatv.relink.ir.type.ConstInt
import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import org.junit.jupiter.api.Test

class RelinkGraphStdTest {
    private val graph = RelinkGraphStd(
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
        nodeTypeRegistry = emptyMap()
    )

    @Test
    fun serialize() {
        println(graph.serializeIR())
    }

    @Test
    fun loadFromIRSerialization() {
        val jsonStr = """
            {
                "graphName": "TestGraph",
                "workflows": [
                    {
                        "workflowName": "testWorkflow1",
                        "nodes": [
                            {
                                "nodeId": "entry",
                                "outputs": [
                                    {
                                        "type": "RInt",
                                        "label": "x"
                                    },
                                    {
                                        "type": "RInt",
                                        "label": "y"
                                    }
                                ],
                                "nodeRole": "SOURCE",
                                "nodeType": "ENTRY",
                                "execInputs": [

                                ],
                                "execOutputs": [
                                    {
                                        "label": "exec"
                                    }
                                ],
                                "inputs": [

                                ]
                            },
                            {
                                "nodeId": "exit1",
                                "inputs": [
                                    {
                                        "type": "RInt",
                                        "label": "z"
                                    }
                                ],
                                "nodeRole": "SINK",
                                "nodeType": "EXIT",
                                "execInputs": [
                                    {
                                        "label": "exec"
                                    }
                                ],
                                "execOutputs": [

                                ],
                                "outputs": [

                                ]
                            },
                            {
                                "nodeId": "exit2",
                                "inputs": [
                                    {
                                        "type": "RInt",
                                        "label": "z"
                                    }
                                ],
                                "nodeRole": "SINK",
                                "nodeType": "EXIT",
                                "execInputs": [
                                    {
                                        "label": "exec"
                                    }
                                ],
                                "execOutputs": [

                                ],
                                "outputs": [

                                ]
                            },
                            {
                                "nodeId": "const1",
                                "constValue": {
                                    "type": "RInt",
                                    "value": 233
                                },
                                "nodeRole": "SOURCE",
                                "nodeType": "CONST",
                                "execInputs": [

                                ],
                                "execOutputs": [

                                ],
                                "inputs": [

                                ],
                                "outputs": [
                                    {
                                        "type": "RInt",
                                        "label": "value"
                                    }
                                ]
                            },
                            {
                                "nodeId": "add",
                                "operandType": "RInt",
                                "nodeRole": "PURE",
                                "nodeType": "ADD",
                                "execInputs": [

                                ],
                                "execOutputs": [

                                ],
                                "inputs": [
                                    {
                                        "type": "RInt",
                                        "label": "x"
                                    },
                                    {
                                        "type": "RInt",
                                        "label": "y"
                                    }
                                ],
                                "outputs": [
                                    {
                                        "type": "RInt",
                                        "label": "z"
                                    }
                                ]
                            },
                            {
                                "nodeId": "mul",
                                "operandType": "RInt",
                                "nodeRole": "PURE",
                                "nodeType": "MUL",
                                "execInputs": [

                                ],
                                "execOutputs": [

                                ],
                                "inputs": [
                                    {
                                        "type": "RInt",
                                        "label": "x"
                                    },
                                    {
                                        "type": "RInt",
                                        "label": "y"
                                    }
                                ],
                                "outputs": [
                                    {
                                        "type": "RInt",
                                        "label": "z"
                                    }
                                ]
                            },
                            {
                                "nodeId": "gt",
                                "operandType": "RInt",
                                "nodeRole": "PURE",
                                "nodeType": "GT",
                                "execInputs": [

                                ],
                                "execOutputs": [

                                ],
                                "inputs": [
                                    {
                                        "type": "RInt",
                                        "label": "x"
                                    },
                                    {
                                        "type": "RInt",
                                        "label": "y"
                                    }
                                ],
                                "outputs": [
                                    {
                                        "type": "RBoolean",
                                        "label": "z"
                                    }
                                ]
                            },
                            {
                                "nodeId": "const2",
                                "constValue": {
                                    "type": "RInt",
                                    "value": 0
                                },
                                "nodeRole": "SOURCE",
                                "nodeType": "CONST",
                                "execInputs": [

                                ],
                                "execOutputs": [

                                ],
                                "inputs": [

                                ],
                                "outputs": [
                                    {
                                        "type": "RInt",
                                        "label": "value"
                                    }
                                ]
                            },
                            {
                                "nodeId": "if",
                                "nodeRole": "CONTROL",
                                "nodeType": "IF",
                                "execInputs": [
                                    {
                                        "label": "exec"
                                    }
                                ],
                                "execOutputs": [
                                    {
                                        "label": "true"
                                    },
                                    {
                                        "label": "false"
                                    }
                                ],
                                "inputs": [
                                    {
                                        "type": "RBoolean",
                                        "label": "condition"
                                    }
                                ],
                                "outputs": [

                                ]
                            }
                        ],
                        "portEdges": [
                            {
                                "from": "entry",
                                "fromPort": "x",
                                "to": "add",
                                "toPort": "x"
                            },
                            {
                                "from": "entry",
                                "fromPort": "y",
                                "to": "add",
                                "toPort": "y"
                            },
                            {
                                "from": "add",
                                "fromPort": "z",
                                "to": "mul",
                                "toPort": "x"
                            },
                            {
                                "from": "const1",
                                "fromPort": "value",
                                "to": "mul",
                                "toPort": "y"
                            },
                            {
                                "from": "mul",
                                "fromPort": "z",
                                "to": "gt",
                                "toPort": "x"
                            },
                            {
                                "from": "const2",
                                "fromPort": "value",
                                "to": "gt",
                                "toPort": "y"
                            },
                            {
                                "from": "gt",
                                "fromPort": "z",
                                "to": "if",
                                "toPort": "condition"
                            },
                            {
                                "from": "entry",
                                "fromPort": "exec",
                                "to": "if",
                                "toPort": "exec"
                            },
                            {
                                "from": "add",
                                "fromPort": "z",
                                "to": "exit1",
                                "toPort": "z"
                            },
                            {
                                "from": "mul",
                                "fromPort": "z",
                                "to": "exit2",
                                "toPort": "z"
                            },
                            {
                                "from": "if",
                                "fromPort": "true",
                                "to": "exit1",
                                "toPort": "exec"
                            },
                            {
                                "from": "if",
                                "fromPort": "false",
                                "to": "exit2",
                                "toPort": "exec"
                            }
                        ]
                    }
                ]
            }
        """.trimIndent()

        graph.loadFromIRSerialization(jsonStr)
    }

}