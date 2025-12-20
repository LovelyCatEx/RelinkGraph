/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.workflow

import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.std.ir.workflow.node.*
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.runtime.toDisplayString
import com.lovelycatv.relink.std.runtime.type.RuntimeValue
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.CoroutineContext

class WorkflowExecution(
    val executionId: String,
    val workflow: Workflow,
    val listener: WorkflowExecutionListener? = null,
    executionContext: CoroutineContext = Dispatchers.IO
) {
    private var executionStarted = false

    val nodeExecutor = WorkflowExecutionCoroutineScope(this, executionContext)

    private val nodeExecutionResultMap: MutableMap<NodeId, Map<PortLabel, RuntimeValue>> = mutableMapOf()

    fun startExecution(inputs: Map<PortLabel, RuntimeValue>) {
        if (executionStarted) {
            throw IllegalStateException("WorkflowExecution $executionId is already started before")
        }

        val entry = workflow.getEntry()

        nodeExecutor.launchExecution(entry, null) {
            this.executeNode(entry, inputs)
        }
    }

    private suspend fun pureExecute(
        node: IrBaseNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        val executor = workflow.ctx.bindings.executorFor(node)
        return executor.execute(node, inputs)
    }

    private suspend fun executeNode(
        node: IrBaseNode,
        inputs: Map<PortLabel, RuntimeValue>
    ) {
        when (node.nodeType) {
            StdNodeType.ENTRY -> {
                listener?.onStart(inputs)
            }

            StdNodeType.EXIT -> {
                listener?.onFinish(this.pureExecute(node, inputs))
                return
            }
        }

        val nextNodes = when (node) {
            // Action, Source
            is IrCachedExecutionResultNode -> {
                val executeResult = this.pureExecute(node, inputs)

                // Save execution result to global map
                nodeExecutionResultMap[node.nodeId] = executeResult

                workflow.queryEdge(node)
                    .execTargets
                    .values
                    .flatten()
                    .map { this.workflow.getNodeById(it.to) }
            }

            is IrControlNode -> {
                val executor = workflow.ctx.bindings.executorFor(node)

                val determineResult = executor.determineOutputExecs(node, inputs)

                workflow.queryEdge(node)
                    .execTargets
                    .filterKeys { it.label in determineResult }
                    .values
                    .flatten()
                    .map { this.workflow.getNodeById(it.to) }
            }

            else -> throw UnsupportedOperationException("Node type ${node.javaClass.name} is not supported")
        }

        // Execute next nodes
        nextNodes.forEach { nextNode ->
            nodeExecutor.launchExecution(nextNode, node) {
                val inputs = resolveInputParameters(nextNode).mapKeys { it.key.label }
                this.executeNode(
                    node = nextNode,
                    inputs = inputs
                )
            }
        }
    }

    private suspend fun resolveInputParameters(node: IrBaseNode): Map<ParamPort, RuntimeValue>
            = node.inputs.associateWith { inputParameter ->
        // Find or Compute required parameter
        val queryResult = workflow.queryEdge(node)

        val parameterOrigin = queryResult.parameterOrigins[inputParameter]
            ?: throw IllegalStateException("Node ${node.nodeId} requires parameter ${inputParameter.label} but acquired undefined")

        // Check the fromNode type
        val fromNode = workflow.getNodeById(parameterOrigin.from)

        resolveComputedInputParameter(
            node,
            inputParameter,
            fromNode,
            parameterOrigin.fromPort
        )
    }

    private suspend fun resolveComputedInputParameter(
        requirerNode: IrBaseNode,
        inputParameter: ParamPort,
        fromNode: IrBaseNode,
        fromNodeOutputPort: PortLabel
    ): RuntimeValue = when (fromNode) {
        // Action, Source
        is IrCachedExecutionResultNode -> {
            when (fromNode) {
                is IrActionNode -> {
                    nodeExecutionResultMap[fromNode.nodeId]?.get(fromNodeOutputPort)
                        ?: throw IllegalStateException("Node ${requirerNode.nodeId} requires parameter ${inputParameter.label} but acquired null caused by unfinished execution of node ${fromNode.nodeId}")
                }

                is IrSourceNode -> {
                    nodeExecutionResultMap[fromNode.nodeId]?.get(fromNodeOutputPort)
                        ?: this.pureExecute(fromNode, emptyMap()).run {
                            nodeExecutionResultMap[fromNode.nodeId] = this
                            this[fromNodeOutputPort]
                        }
                        ?: throw IllegalStateException("Node ${requirerNode.nodeId} requires parameter ${inputParameter.label} but acquired null caused by unfinished execution of node ${fromNode.nodeId}")
                }

                else -> throw UnsupportedOperationException("Node type ${fromNode.nodeType} is not supported")
            }
           }

        // Pure
        is IrPureNode -> {
            val inputs = resolveInputParameters(fromNode).mapKeys { it.key.label }

            val result = this.pureExecute(
                fromNode,
                inputs
            )

            result.entries.find { it.key == fromNodeOutputPort }?.value
                ?: throw NullPointerException("Could not resolve computed input parameter ${inputParameter.label} " +
                        "of ${requirerNode.nodeId} from $fromNodeOutputPort of ${fromNode.nodeId}, " +
                        "executed ${fromNode.nodeId} with parameters ${inputs.toDisplayString()} and result is ${result.toDisplayString()}")
        }

        // Control, Sink
        else -> throw UnsupportedOperationException("Node ${requirerNode.nodeId} requires parameter ${inputParameter.label} but acquired from $fromNodeOutputPort of ${fromNode.nodeId} which is incapable")
    }
}