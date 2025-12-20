/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.graph

import com.lovelycatv.relink.ir.IrRelinkGraph
import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.runtime.workflow.Workflow
import com.lovelycatv.relink.runtime.workflow.WorkflowExecutionListener
import com.lovelycatv.relink.std.runtime.graph.RelinkGraphStd
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

class RelinkGraph(
    ir: IrRelinkGraph
) : RelinkGraphStd(ir) {
    private val workflows: MutableMap<String, Workflow> = this.ir.workflows
        .associateBy { it.workflowName }
        .mapValues { Workflow(it.value, GraphContext(executors)) }
        .toMutableMap()

    fun executeWorkflowAsync(
        workflowName: String,
        inputs: Map<PortLabel, RuntimeValue>,
        listener: WorkflowExecutionListener? = null
    ) {
        this.getWorkflowByName(workflowName).executeAsync(inputs, listener)
    }

    suspend fun executeWorkflow(
        workflowName: String,
        inputs: Map<PortLabel, RuntimeValue>,
        listener: WorkflowExecutionListener? = null
    ): Map<PortLabel, RuntimeValue> {
        return this.getWorkflowByName(workflowName).execute(inputs, listener)
    }

    fun getWorkflowByName(name: String): Workflow {
        return this.workflows[name] ?: throw NullPointerException("No workflow found with name $name")
    }
}