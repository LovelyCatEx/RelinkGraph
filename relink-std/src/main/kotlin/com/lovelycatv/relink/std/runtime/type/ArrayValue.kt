/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.type

import com.lovelycatv.relink.ir.type.RArray
import com.lovelycatv.relink.ir.type.RType

data class ArrayValue(
    val elementType: RType,
    override val value: Array<RuntimeValue>
) : RuntimeValue {
    override val type: RType = RArray(elementType)

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ArrayValue

        if (elementType != other.elementType) return false
        if (!value.contentEquals(other.value)) return false
        if (type != other.type) return false

        return true
    }

    override fun hashCode(): Int {
        var result = elementType.hashCode()
        result = 31 * result + value.contentHashCode()
        result = 31 * result + type.hashCode()
        return result
    }
}