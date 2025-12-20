/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.executor

import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.source.IrEntryNode
import com.lovelycatv.relink.std.runtime.type.RuntimeValue

object EntryExecutor : NodeExecutor<IrEntryNode> {
    override suspend fun execute(
        node: IrEntryNode,
        inputs: Map<PortLabel, RuntimeValue>
    ): Map<PortLabel, RuntimeValue> {
        return inputs
    }
}