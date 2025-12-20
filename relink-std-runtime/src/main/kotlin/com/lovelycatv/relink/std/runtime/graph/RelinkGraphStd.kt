/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.graph

import com.lovelycatv.relink.std.ir.IrRelinkGraph
import com.lovelycatv.relink.std.ir.StdNodeType
import com.lovelycatv.relink.std.ir.workflow.node.INodeType
import com.lovelycatv.relink.std.ir.workflow.node.IrBaseNode
import com.lovelycatv.relink.std.runtime.executor.ConstExecutor
import com.lovelycatv.relink.std.runtime.executor.EntryExecutor
import com.lovelycatv.relink.std.runtime.executor.ExitExecutor
import com.lovelycatv.relink.std.runtime.executor.NodeExecutor
import com.lovelycatv.relink.std.runtime.executor.comparator.*
import com.lovelycatv.relink.std.runtime.executor.control.IfExecutor
import com.lovelycatv.relink.std.runtime.executor.math.AddExecutor
import com.lovelycatv.relink.std.runtime.executor.math.DivExecutor
import com.lovelycatv.relink.std.runtime.executor.math.MulExecutor
import com.lovelycatv.relink.std.runtime.executor.math.SubExecutor
import com.lovelycatv.relink.std.runtime.utils.parseObject

open class RelinkGraphStd(
    ir: IrRelinkGraph,
    nodeTypeRegistry: Map<String, INodeType>
) : AbstractSerializableRelinkGraphStd(
    ir = ir,
    nodeTypeRegistry = nodeTypeRegistry + StdNodeType.entries.associateBy { it.getTypeName() }
) {
    protected val executors = ExecutorBindingRegistryStd()

    init {
        registerExecutor(StdNodeType.ENTRY, EntryExecutor)
        registerExecutor(StdNodeType.EXIT, ExitExecutor)
        registerExecutor(StdNodeType.CONST, ConstExecutor)
        registerExecutor(StdNodeType.ADD, AddExecutor)
        registerExecutor(StdNodeType.SUB, SubExecutor)
        registerExecutor(StdNodeType.MUL, MulExecutor)
        registerExecutor(StdNodeType.DIV, DivExecutor)
        registerExecutor(StdNodeType.IF, IfExecutor)
        registerExecutor(StdNodeType.COMPARATOR, ComparatorExecutor)
        registerExecutor(StdNodeType.GT, GTExecutor)
        registerExecutor(StdNodeType.LT, LTExecutor)
        registerExecutor(StdNodeType.EQ, EQExecutor)
        registerExecutor(StdNodeType.GTE, GTEExecutor)
        registerExecutor(StdNodeType.LTE, LTEExecutor)
    }

    fun <N : IrBaseNode> registerExecutor(type: INodeType, executor: NodeExecutor<N>) {
        this.executors.bind(type, executor)
    }

    override fun internalLoadFromIRSerialization(jsonString: String): IrRelinkGraph {
        return jsonString.parseObject<IrRelinkGraph>(super.objectMapper)
    }
}