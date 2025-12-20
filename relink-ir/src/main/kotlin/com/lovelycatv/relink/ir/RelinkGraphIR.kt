/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir

import com.lovelycatv.relink.std.ir.type.IR_STD_TYPES
import com.lovelycatv.relink.std.ir.type.RType

object RelinkGraphIR {
    var initialized = false
        private set

    fun initialize() {
        if (initialized) {
            return
        }

        IR_STD_TYPES.forEach { RType.registerType(it) }

        initialized = true
    }
}