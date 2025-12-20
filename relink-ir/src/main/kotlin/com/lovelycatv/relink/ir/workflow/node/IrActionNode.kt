/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.workflow.node

import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort

open class IrActionNode(
    nodeId: NodeId,
    nodeType: INodeType,
    execInputs: List<ExecPort>,
    execOutputs: List<ExecPort>,
    inputs: List<ParamPort>,
    outputs: List<ParamPort>
) : IrBaseNode(nodeId, NodeRole.ACTION, nodeType, execInputs, execOutputs, inputs, outputs),
    IrCachedExecutionResultNode