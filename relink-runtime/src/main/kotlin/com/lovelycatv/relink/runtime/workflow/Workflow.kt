/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.workflow

import com.lovelycatv.relink.runtime.graph.EdgeQueryResult
import com.lovelycatv.relink.runtime.graph.GraphContext
import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.source.IrEntryNode
import com.lovelycatv.relink.std.ir.workflow.IrWorkflow
import com.lovelycatv.relink.std.ir.workflow.node.IrBaseNode
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.runtime.type.InferredRType
import com.lovelycatv.relink.std.runtime.type.RuntimeValue
import com.lovelycatv.relink.std.runtime.utils.UUID
import kotlinx.coroutines.asCoroutineDispatcher
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit
import kotlin.coroutines.CoroutineContext
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class Workflow(
    val ir: IrWorkflow,
    val ctx: GraphContext
) {
    private val executor = ThreadPoolExecutor(
        4,
        8,
        60L,
        TimeUnit.MINUTES,
        LinkedBlockingQueue()
    ).asCoroutineDispatcher()

    private val executions: MutableMap<String, WorkflowExecution> = mutableMapOf()

    fun executeAsync(inputs: Map<PortLabel, RuntimeValue>, listener: WorkflowExecutionListener? = null): WorkflowExecution {
        val execution = WorkflowExecution(UUID.randomUUID(), this, listener, executor)

        execution.startExecution(inputs)

        this.executions[execution.executionId] = execution

        return execution
    }

    suspend fun execute(inputs: Map<PortLabel, RuntimeValue>, listener: WorkflowExecutionListener? = null): Map<PortLabel, RuntimeValue> {
        val actualListener = listener ?: SimpleWorkflowExecutionListener()

        return suspendCoroutine { continuation ->
            this.executeAsync(inputs, object : WorkflowExecutionListener by actualListener {
                override fun onFinish(outputs: Map<PortLabel, RuntimeValue>) {
                    actualListener.onFinish(outputs)
                    continuation.resume(outputs)
                }

                override fun onError(ctx: CoroutineContext, e: Throwable) {
                    actualListener.onError(ctx, e)
                    continuation.resumeWithException(e)
                }
            })
        }
    }

    fun queryEdge(nodeId: NodeId): EdgeQueryResult {
        return this.queryEdge(this.getNodeById(nodeId))
    }

    fun queryEdge(node: IrBaseNode): EdgeQueryResult {
        return EdgeQueryResult(
            node = node,
            execOrigins = node.execInputs.associateWith { execInput ->
                this.ir.portEdges
                    .filter { it.to == node.nodeId && it.toPort == execInput.label }
            },
            execTargets = node.execOutputs.associateWith { execPort ->
                this.ir.portEdges
                    .filter { it.from == node.nodeId && it.fromPort == execPort.label }
            },
            parameterOrigins = node.inputs.associateWith { paramPort ->
                this.ir.portEdges.firstOrNull { it.to == node.nodeId && it.toPort == paramPort.label }
            },
            parameterTargets = node.outputs.associateWith { paramPort ->
                this.ir.portEdges.filter { it.from == node.nodeId && it.fromPort == paramPort.label }
            }
        )
    }

    fun getEntry(): IrEntryNode {
        val entryList = this.ir.nodes.filterIsInstance<IrEntryNode>()
        if (entryList.isEmpty()) {
            throw IllegalStateException("No entry found for workflow ${ir.workflowName}")
        }

        if (entryList.size > 1) {
            throw IllegalStateException("There are multiple entries for workflow ${ir.workflowName} which is disallowed")
        }

        return entryList.first()
    }

    fun inferReturnValueTypes(): List<InferredRType> {
        val nodeInputs = this.ir.nodes.filterIsInstance<com.lovelycatv.relink.std.ir.sink.IrExitNode>().map { it.inputs }

        val exitCount = nodeInputs.size

        val (nonNullable, nullable) = nodeInputs
            .flatten()
            .groupingBy { ParamPort(it.type, it.label) }
            .eachCount()
            .entries
            .partition { it.value == exitCount }

        return nonNullable.map {
            InferredRType(it.key.type, false)
        } + nullable.map {
            InferredRType(it.key.type, true)
        }
    }

    fun getNodeById(nodeId: NodeId): IrBaseNode {
        return this.ir.nodes.find { it.nodeId == nodeId }
            ?: throw NullPointerException("Node $nodeId not found")
    }
}