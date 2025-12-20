/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.utils

import com.lovelycatv.relink.ir.IrRelinkGraph
import com.lovelycatv.relink.ir.type.ConstDouble
import com.lovelycatv.relink.ir.type.RInt
import com.lovelycatv.relink.ir.workflow.node.IrPureNode
import com.lovelycatv.relink.ir.workflow.node.NodeRole
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.std.ir.source.IrConstantNode
import com.lovelycatv.relink.std.runtime.graph.RelinkGraphStd
import kotlin.test.Test
import kotlin.test.assertEquals

class SerializationExtensionsTest {
    private val graph = RelinkGraphStd(
        IrRelinkGraph("TestGraph", listOf()),
        mapOf()
    )

    @Test
    fun testToJSONString() {
        val obj1 = IrPureNode(
            "testNode",
            StdNodeType.ADD,
            listOf(
                ParamPort(RInt, "x"),
                ParamPort(RInt, "y")
            ),
            listOf(
                ParamPort(RInt, "z")
            )
        )

        println(obj1.toJSONString(graph.objectMapper))

        val obj2 = IrConstantNode("const", ConstDouble(3.14))

        println(obj2.toJSONString(graph.objectMapper))
    }

    @Test
    fun testParseObject() {
        val graph = RelinkGraphStd(
            IrRelinkGraph("TestGraph", listOf()),
            mapOf()
        )

        val jsonStr1 = """
            {
                "nodeId": "testNode",
                "nodeType": "ADD",
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
                ],
                "nodeRole": "PURE",
                "execInputs": [
            
                ],
                "execOutputs": [
            
                ]
            }
        """.trimIndent()

        val node1 = jsonStr1.parseObject<IrPureNode>(graph.objectMapper)

        assertEquals("testNode", node1.nodeId)
        assertEquals(NodeRole.PURE, node1.nodeRole)
        assertEquals(StdNodeType.ADD, node1.nodeType)
        assertEquals(RInt, node1.inputs[0].type)
        assertEquals("x", node1.inputs[0].label)
        assertEquals(RInt, node1.inputs[1].type)
        assertEquals("y", node1.inputs[1].label)
        assertEquals(RInt, node1.outputs[0].type)
        assertEquals("z", node1.outputs[0].label)

        val jsonStr2 = """
            {
                "nodeId": "const",
                "constValue": {
                    "type": "RDouble",
                    "value": 3.14
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
                        "type": "RDouble",
                        "label": "value"
                    }
                ]
            }
        """.trimIndent()

        val node2 = jsonStr2.parseObject<IrConstantNode>(graph.objectMapper)

        assertEquals("const", node2.nodeId)
        assertEquals(NodeRole.SOURCE, node2.nodeRole)
        assertEquals(StdNodeType.CONST, node2.nodeType)
    }
}