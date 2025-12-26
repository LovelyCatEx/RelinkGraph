/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.graph

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.lovelycatv.relink.ir.workflow.node.IrControlNode
import com.lovelycatv.relink.ir.IrRelinkGraph
import com.lovelycatv.relink.ir.RelinkGraphIR
import com.lovelycatv.relink.std.ir.control.IrIfNode
import com.lovelycatv.relink.std.ir.sink.IrExitNode
import com.lovelycatv.relink.std.ir.source.IrConstantNode
import com.lovelycatv.relink.std.ir.source.IrEntryNode
import com.lovelycatv.relink.ir.type.*
import com.lovelycatv.relink.ir.workflow.node.*
import com.lovelycatv.relink.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.std.ir.pure.comparator.IrComparatorNode
import com.lovelycatv.relink.std.ir.pure.comparator.IrEQNode
import com.lovelycatv.relink.std.ir.pure.comparator.IrGTENode
import com.lovelycatv.relink.std.ir.pure.comparator.IrGTNode
import com.lovelycatv.relink.std.ir.pure.comparator.IrLTENode
import com.lovelycatv.relink.std.ir.pure.comparator.IrLTNode
import com.lovelycatv.relink.std.ir.pure.math.IrAddNode
import com.lovelycatv.relink.std.ir.pure.math.IrDivNode
import com.lovelycatv.relink.std.ir.pure.math.IrMulNode
import com.lovelycatv.relink.std.ir.pure.math.IrSubNode
import com.lovelycatv.relink.std.runtime.utils.toJSONString

abstract class AbstractSerializableRelinkGraphStd(
    var ir: IrRelinkGraph ,
    private val nodeTypeRegistry: Map<String, INodeType>
) {
    val objectMapper = jacksonObjectMapper()

    init {
        RelinkGraphIR.initialize()

        this.registerNodeTypes()
        this.registerRTypes()
        this.registerConstValues()
        this.registerStdNodes()
    }

    fun serializeIR(): String {
        return this.ir.toJSONString(this.objectMapper)
    }

    fun loadFromIRSerialization(jsonString: String) {
        this.ir = this.internalLoadFromIRSerialization(jsonString)
    }

    protected abstract fun internalLoadFromIRSerialization(jsonString: String): IrRelinkGraph

    private fun registerNodeTypes() {
        this.registerModule(
            "RelinkGraphNodeTypeModule",
            serializer = { t, generator ->
                generator.writeString(t.getTypeName())
            },
            deserializer = {
                val key = it.valueAsString
                nodeTypeRegistry[key]
                    ?: throw IllegalArgumentException("Unknown node type: $key")
            }
        )
    }

    private fun registerRTypes() {
        this.registerModule(
            "RelinkGraphRTypeModule",
            serializer = { t, generator ->
                generator.writeString(t.qualifiedName)
            },
            deserializer = {
                val qualifiedName = it.valueAsString
                RType.forName(qualifiedName)
            }
        )
    }

    private fun registerConstValues() {
        this.registerModule(
            "RelinkGraphConstValuesModule",
            serializer = { t, generator ->
                generator.writeObject(
                    mapOf(
                        "type" to t.type,
                        "value" to t.value
                    )
                )
            },
            deserializer = {
                @Suppress("UNCHECKED_CAST")
                val map = it.readValueAs(Map::class.java) as Map<String, Any?>

                val typeQualifiedName = map["type"]?.toString() ?: throw NullPointerException("Could not found type in $map")
                val value = map["value"]?.toString() ?: throw NullPointerException("Could not found value in $map")

                when (val type = RType.forName(typeQualifiedName)) {
                    RChar -> ConstChar(value[0])
                    RByte -> ConstByte(value.toByte())
                    RShort -> ConstShort(value.toShort())
                    RInt -> ConstInt(value.toInt())
                    RLong -> ConstLong(value.toLong())
                    RFloat -> ConstFloat(value.toFloat())
                    RDouble -> ConstDouble(value.toDouble())
                    RBoolean -> ConstBoolean(value.toBoolean())
                    else -> throw IllegalArgumentException("Unknown value type: ${type.qualifiedName}")
                }
            }
        )
    }

    @Suppress("UNCHECKED_CAST")
    private fun registerStdNodes() {
        val module = SimpleModule("RelinkGraphStdNodesModule")
            .addDeserializer(
                IrBaseNode::class.java,
                object : JsonDeserializer<IrBaseNode>() {
                    override fun deserialize(
                        p0: JsonParser,
                        p1: DeserializationContext
                    ): IrBaseNode {
                        val map = p0.readValueAs(Map::class.java) as Map<String, Any?>

                        val nodeId = map["nodeId"] as String
                        val nodeType = nodeTypeRegistry[map["nodeType"] as String]!!
                        val nodeRole = NodeRole.valueOf(map["nodeRole"] as String)
                        val execInputs = (map["execInputs"] as List<Map<String, Any?>>).map {
                            ExecPort(label = it["label"] as String)
                        }
                        val execOutputs = (map["execOutputs"] as List<Map<String, Any?>>).map {
                            ExecPort(label = it["label"] as String)
                        }
                        val inputs = (map["inputs"] as List<Map<String, Any?>>).map {
                            ParamPort(
                                type = RType.forName(it["type"] as String),
                                label = it["label"] as String
                            )
                        }
                        val outputs = (map["outputs"] as List<Map<String, Any?>>).map {
                            ParamPort(
                                type = RType.forName(it["type"] as String),
                                label = it["label"] as String
                            )
                        }

                        return when (nodeType) {
                            StdNodeType.ENTRY -> IrEntryNode(nodeId, outputs)
                            StdNodeType.EXIT -> IrExitNode(nodeId, inputs)
                            StdNodeType.CONST -> {
                                val constValueRaw = map["constValue"]
                                    ?: throw NullPointerException("Missing constValue for StdNodeType.CONST ($nodeId)")
                                val constValue = objectMapper.convertValue(constValueRaw, ConstValue::class.java)
                                IrConstantNode(nodeId, constValue)
                            }
                            StdNodeType.ADD -> IrAddNode(nodeId, inputs.first().type as RNumber)
                            StdNodeType.SUB -> IrSubNode(nodeId, inputs.first().type as RNumber)
                            StdNodeType.MUL -> IrMulNode(nodeId, inputs.first().type as RNumber)
                            StdNodeType.DIV -> IrDivNode(nodeId, inputs.first().type as RNumber)
                            StdNodeType.COMPARATOR -> IrComparatorNode(nodeId, inputs.first().type as RComparable)
                            StdNodeType.GT -> IrGTNode(nodeId, inputs.first().type as RComparable)
                            StdNodeType.LT -> IrLTNode(nodeId, inputs.first().type as RComparable)
                            StdNodeType.EQ -> IrEQNode(nodeId, inputs.first().type as RComparable)
                            StdNodeType.GTE -> IrGTENode(nodeId, inputs.first().type as RComparable)
                            StdNodeType.LTE -> IrLTENode(nodeId, inputs.first().type as RComparable)
                            StdNodeType.IF -> IrIfNode(nodeId)
                            else -> {
                                when (nodeRole) {
                                    NodeRole.ACTION -> IrActionNode(nodeId, nodeType, execInputs, execOutputs, inputs, outputs)
                                    NodeRole.CONTROL -> IrControlNode(nodeId, nodeType, execInputs, execOutputs, inputs)
                                    NodeRole.PURE -> IrPureNode(nodeId, nodeType, inputs, outputs)
                                    NodeRole.SOURCE -> IrSourceNode(nodeId, nodeType, execOutputs.firstOrNull(), outputs)
                                    NodeRole.SINK -> IrSinkNode(
                                        nodeId,
                                        nodeType,
                                        execInputs.firstOrNull()
                                            ?: throw IllegalStateException("There must be 1 in ExecPort in a SinkNode"),
                                        inputs
                                    )
                                }
                            }
                        }
                    }

                }
            )

        this.objectMapper.registerModule(module)
    }

    private inline fun <reified T> registerModule(
        moduleName: String,
        crossinline serializer: (t: T, gen: JsonGenerator) -> Unit,
        crossinline deserializer: (parser: JsonParser) -> T
    ) {
        val module = SimpleModule(moduleName)
            .addSerializer(
                T::class.java,
                object : JsonSerializer<T>() {
                    override fun serialize(
                        p0: T,
                        p1: JsonGenerator,
                        p2: SerializerProvider
                    ) {
                        serializer.invoke(p0, p1)
                    }

                }
            )
            .addDeserializer(
                T::class.java,
                object : JsonDeserializer<T>() {
                    override fun deserialize(
                        p0: JsonParser,
                        p1: DeserializationContext?
                    ): T? {
                        return deserializer.invoke(p0)
                    }

                }
            )

        this.objectMapper.registerModule(module)
    }
}
