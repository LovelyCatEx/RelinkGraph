/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.workflow.node.port

import com.lovelycatv.relink.ir.PortLabel
import com.lovelycatv.relink.ir.type.RType

data class ParamPort(
    val type: RType,
    override val label: PortLabel
) : INodePort