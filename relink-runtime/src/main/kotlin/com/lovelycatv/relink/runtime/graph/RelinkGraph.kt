/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.graph

import com.lovelycatv.relink.runtime.workflow.Workflow
import com.lovelycatv.relink.runtime.workflow.WorkflowExecutionListener
import com.lovelycatv.relink.std.ir.IrRelinkGraph
import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.workflow.node.INodeType
import com.lovelycatv.relink.std.runtime.graph.RelinkGraphStd
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

class RelinkGraph(
    ir: IrRelinkGraph,
    nodeTypeRegistry: Map<String, INodeType>
) : RelinkGraphStd(ir, nodeTypeRegistry) {
    private val workflows: MutableMap<String, Workflow> = this.buildWorkflows(super.ir)

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

    override fun internalLoadFromIRSerialization(jsonString: String): IrRelinkGraph {
        val ir = super.internalLoadFromIRSerialization(jsonString)

        // Re-build workflows
        this.workflows.clear()

        workflows.putAll(this.buildWorkflows(ir))

        return ir
    }

    private fun buildWorkflows(ir: IrRelinkGraph): MutableMap<String, Workflow> {
        return ir.workflows
            .associateBy { it.workflowName }
            .mapValues { Workflow(it.value, GraphContext(executors)) }
            .toMutableMap()
    }
}