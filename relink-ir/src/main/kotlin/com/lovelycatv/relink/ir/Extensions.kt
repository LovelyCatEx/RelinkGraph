/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir

import com.lovelycatv.relink.std.ir.type.RType
import com.lovelycatv.relink.std.ir.workflow.node.port.INodePort
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort

fun <P : INodePort> Iterable<P>.findByLabel(label: PortLabel): P? {
    return this.find { it.label == label }
}

fun Iterable<ParamPort>.filterByType(type: RType): List<ParamPort> {
    return this.filter { it.type == type }
}