/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.workflow.edge

import com.lovelycatv.relink.std.ir.NodeId
import com.lovelycatv.relink.std.ir.PortLabel

data class IrPortEdge(
    val from: NodeId,
    val fromPort: PortLabel,
    val to: NodeId,
    val toPort: PortLabel,
)