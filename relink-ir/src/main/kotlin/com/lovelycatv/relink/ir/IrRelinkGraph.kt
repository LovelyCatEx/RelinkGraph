/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir

import com.lovelycatv.relink.ir.workflow.IrWorkflow

data class IrRelinkGraph(
    val graphName: String,
    val workflows: List<IrWorkflow>
) {
    class Builder {
        private var graphName: String = ""
        private val workflows: MutableMap<String, IrWorkflow> = mutableMapOf()

        fun name(name: String) = apply {
            this.graphName = name
        }

        fun addWorkflow(workflow: IrWorkflow) = apply {
            if (this.workflows.containsKey(workflow.workflowName)) {
                throw IllegalArgumentException("Duplicate workflow name ${workflow.workflowName}")
            }

            this.workflows[workflow.workflowName] = workflow
        }

        fun addWorkflow(block: IrWorkflow.Builder.() -> Unit) = apply {
            val builder = IrWorkflow.Builder()
            block.invoke(builder)

            this.addWorkflow(builder.build())
        }

        fun build(): IrRelinkGraph {
            return IrRelinkGraph(graphName, workflows.values.toList())
        }
    }
}