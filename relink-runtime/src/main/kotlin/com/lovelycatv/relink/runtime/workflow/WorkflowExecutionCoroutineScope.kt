/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.workflow

import com.lovelycatv.relink.std.ir.workflow.node.IrBaseNode
import kotlinx.coroutines.*
import kotlin.coroutines.CoroutineContext

class WorkflowExecutionCoroutineScope(
    private val workflowExecution: WorkflowExecution,
    private val executionContext: CoroutineContext = Dispatchers.IO
) : CoroutineScope {
    private val core = Job()

    val coroutineName = "Workflow-${workflowExecution.workflow.ir.workflowName}#${workflowExecution.executionId}"
    var exception: ExceptionRecord? = null
        private set

    override val coroutineContext: CoroutineContext
        get() = executionContext + CoroutineName(coroutineName) + core + CoroutineExceptionHandler { ctx, e ->
            exception = ExceptionRecord(ctx, e)

            this.workflowExecution.listener?.onError(ctx, e)
        }

    private val jobs: MutableMap<IrBaseNode, MutableList<WrappedJob>> = mutableMapOf()

    fun launchExecution(node: IrBaseNode, triggeredBy: IrBaseNode?, block: suspend () -> Unit) {
        this.jobs.computeIfAbsent(node) { mutableListOf() }.add(
            WrappedJob(
                triggeredBy = triggeredBy,
                job = this.launch(
                    context = executionContext + CoroutineName("Node-${node.nodeType.getTypeName()}-${node.nodeId}")
                ) {
                    block.invoke()
                }
            )
        )
    }

    data class ExceptionRecord(
        val ctx: CoroutineContext,
        val e: Throwable
    )

    data class WrappedJob(
        val triggeredBy: IrBaseNode?,
        val job: Job
    )
}