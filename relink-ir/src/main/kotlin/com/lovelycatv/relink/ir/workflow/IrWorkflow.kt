/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.workflow

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.ir.workflow.edge.IrPortEdge
import com.lovelycatv.relink.ir.workflow.node.IrBaseNode
import com.lovelycatv.relink.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort

data class IrWorkflow(
    val workflowName: String,
    val nodes: List<IrBaseNode>,
    val portEdges: List<IrPortEdge>
) {
    class Builder {
        private var workflowName: String = ""
        private val nodes: MutableMap<NodeId, IrBaseNode> = mutableMapOf()
        private val portEdges: MutableList<IrPortEdge> = mutableListOf()

        fun name(name: String) = apply {
            this.workflowName = name
        }

        fun addNode(node: IrBaseNode) = apply {
            this.nodes[node.nodeId] = node
        }

        fun makeConnection(from: NodeId, fromPort: PortLabel, to: NodeId, toPort: PortLabel) = apply {
            this.assertCanMakeConnection(from, fromPort, to, toPort)

            this.addEdge(IrPortEdge(from, fromPort, to, toPort))
        }

        private fun assertCanMakeConnection(from: NodeId, fromPort: PortLabel, to: NodeId, toPort: PortLabel) {
            val fromNode = this.nodes[from] ?: throw IllegalArgumentException("Source node $from doesn't exist")
            val toNode = this.nodes[to] ?: throw IllegalArgumentException("Target node $to doesn't exist")

            val fromPortRef = (fromNode.execOutputs + fromNode.outputs)
                .find { it.label == fromPort }
                ?: throw IllegalArgumentException("Port $fromPort doesn't exist in $from")
            val toPortRef = (toNode.execInputs + toNode.inputs)
                .find { it.label == toPort }
                ?: throw IllegalArgumentException("Port $toPort doesn't exist in $to")

            // Validate port type
            when (fromPortRef) {
                is ExecPort if toPortRef is ExecPort -> Unit
                is ParamPort if toPortRef is ParamPort -> Unit
                else -> throw IllegalStateException("Port $fromPort of $from is not capable for Port $toPort of $to")
            }

            if (fromPortRef is ParamPort && from == to) {
                throw IllegalArgumentException("Param port cannot connect to the same node ($from)")
            }

            if (toPortRef is ParamPort) {
                val alreadyConnected = portEdges.any {
                    it.to == to && it.toPort == toPort
                }

                if (alreadyConnected) {
                    throw IllegalStateException("Param input port $toPort of node $to already has a connection")
                }
            }

            if (fromPortRef is ParamPort && toPortRef is ParamPort) {
                if (!toPortRef.type.isAssignableFrom(fromPortRef.type)) {
                    throw IllegalArgumentException("Type mismatch: ${fromPortRef.type} -> ${toPortRef.type}")
                }
            }
        }

        private fun addEdge(node: IrPortEdge) = apply {
            portEdges.add(node)
        }

        fun build(): IrWorkflow {
            return IrWorkflow(workflowName, nodes.values.toList(), portEdges)
        }
    }
}