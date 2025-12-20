/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.runtime.workflow

import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.runtime.type.RuntimeValue
import kotlin.coroutines.CoroutineContext

class SimpleWorkflowExecutionListener : WorkflowExecutionListener {
    override fun onStart(inputs: Map<PortLabel, RuntimeValue>) {}

    override fun onFinish(outputs: Map<PortLabel, RuntimeValue>) {}

    override fun onError(ctx: CoroutineContext, e: Throwable) {}
}