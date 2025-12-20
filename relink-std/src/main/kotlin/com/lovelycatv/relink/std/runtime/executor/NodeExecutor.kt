package com.lovelycatv.relink.std.runtime.executor

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.ir.workflow.node.IrBaseNode
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

interface NodeExecutor<N : IrBaseNode> {
    suspend fun execute(
        node: N,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue>

    suspend fun determineOutputExecs(
        node: N,
        inputs: Map<PortLabel, RuntimeValue>
    ): List<PortLabel> {
        return listOf()
    }
}