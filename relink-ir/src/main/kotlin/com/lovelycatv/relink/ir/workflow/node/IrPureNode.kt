/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.workflow.node

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort
import kotlinx.serialization.Serializable

@Serializable
open class IrPureNode(
    nodeId: NodeId,
    nodeType: INodeType,
    inputs: List<ParamPort>,
    outputs: List<ParamPort>
) : IrBaseNode(nodeId, NodeRole.PURE, nodeType, listOf(), listOf(), inputs, outputs)