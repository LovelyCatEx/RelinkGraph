/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.graph

import com.lovelycatv.relink.ir.workflow.edge.IrPortEdge
import com.lovelycatv.relink.ir.workflow.node.IrBaseNode
import com.lovelycatv.relink.ir.workflow.node.port.ExecPort
import com.lovelycatv.relink.ir.workflow.node.port.ParamPort

data class EdgeQueryResult(
    val node: IrBaseNode,
    val execOrigins: Map<ExecPort, List<IrPortEdge>>,
    val execTargets: Map<ExecPort, List<IrPortEdge>>,
    val parameterOrigins: Map<ParamPort, IrPortEdge?>,
    val parameterTargets: Map<ParamPort, List<IrPortEdge>>
)