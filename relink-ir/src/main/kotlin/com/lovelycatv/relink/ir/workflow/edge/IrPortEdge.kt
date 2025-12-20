/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.workflow.edge

import com.lovelycatv.relink.ir.NodeId
import com.lovelycatv.relink.ir.PortLabel
import kotlinx.serialization.Serializable

@Serializable
data class IrPortEdge(
    val from: NodeId,
    val fromPort: PortLabel,
    val to: NodeId,
    val toPort: PortLabel,
)