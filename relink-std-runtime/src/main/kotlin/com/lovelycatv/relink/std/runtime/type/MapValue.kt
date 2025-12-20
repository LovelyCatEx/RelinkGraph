/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.type

import com.lovelycatv.relink.std.ir.type.RMap
import com.lovelycatv.relink.std.ir.type.RType

data class MapValue(
    val keyType: RType,
    val valueType: RType,
    override val value: Map<RuntimeValue, RuntimeValue>
) : RuntimeValue {
    override val type: RType = RMap(keyType, valueType)
}