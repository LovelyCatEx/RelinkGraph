/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.type

import com.lovelycatv.relink.std.ir.type.*
import com.lovelycatv.relink.std.runtime.*

data class StringValue(override val value: String) : RuntimeValue {
    override val type: RType = RString
}

data class BooleanValue(override val value: Boolean) : RuntimeValue {
    override val type: RType = RBoolean
}

data class CharValue(override val value: Char) : RuntimeValue {
    override val type: RType = RChar
}

data class ByteValue(override val value: Byte) : NumberValue(RByte) {
    override val type: RComparable = RByte

    override fun compareTo(other: ComparableValue): IntValue {
        if (other.type !is RNumber) {
            throw IllegalArgumentException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }

        return when (other.type) {
            is RByte -> this.value.compareTo(other.byteValue())
            is RShort -> this.value.compareTo(other.shortValue())
            is RInt -> this.value.compareTo(other.intValue())
            is RLong -> this.value.compareTo(other.longValue())
            is RFloat -> this.value.compareTo(other.floatValue())
            is RDouble -> this.value.compareTo(other.doubleValue())

            else -> throw UnsupportedOperationException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }.asRuntimeValue()
    }
}

data class ShortValue(override val value: Short) : NumberValue(RShort) {
    override val type: RComparable = RShort

    override fun compareTo(other: ComparableValue): IntValue {
        if (other.type !is RNumber) {
            throw IllegalArgumentException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }

        return when (other.type) {
            is RByte -> this.value.compareTo(other.byteValue())
            is RShort -> this.value.compareTo(other.shortValue())
            is RInt -> this.value.compareTo(other.intValue())
            is RLong -> this.value.compareTo(other.longValue())
            is RFloat -> this.value.compareTo(other.floatValue())
            is RDouble -> this.value.compareTo(other.doubleValue())

            else -> throw UnsupportedOperationException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }.asRuntimeValue()
    }
}

data class IntValue(override val value: Int) : NumberValue(RInt) {
    override val type: RComparable = RInt

    override fun compareTo(other: ComparableValue): IntValue {
        if (other.type !is RNumber) {
            throw IllegalArgumentException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }

        return when (other.type) {
            is RByte -> this.value.compareTo(other.byteValue())
            is RShort -> this.value.compareTo(other.shortValue())
            is RInt -> this.value.compareTo(other.intValue())
            is RLong -> this.value.compareTo(other.longValue())
            is RFloat -> this.value.compareTo(other.floatValue())
            is RDouble -> this.value.compareTo(other.doubleValue())

            else -> throw UnsupportedOperationException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }.asRuntimeValue()
    }
}

data class LongValue(override val value: Long) : NumberValue(RLong) {
    override val type: RComparable = RLong

    override fun compareTo(other: ComparableValue): IntValue {
        if (other.type !is RNumber) {
            throw IllegalArgumentException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }

        return when (other.type) {
            is RByte -> this.value.compareTo(other.byteValue())
            is RShort -> this.value.compareTo(other.shortValue())
            is RInt -> this.value.compareTo(other.intValue())
            is RLong -> this.value.compareTo(other.longValue())
            is RFloat -> this.value.compareTo(other.floatValue())
            is RDouble -> this.value.compareTo(other.doubleValue())

            else -> throw UnsupportedOperationException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }.asRuntimeValue()
    }
}

data class FloatValue(override val value: Float) : NumberValue(RFloat) {
    override val type: RComparable = RFloat

    override fun compareTo(other: ComparableValue): IntValue {
        if (other.type !is RNumber) {
            throw IllegalArgumentException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }

        return when (other.type) {
            is RByte -> this.value.compareTo(other.byteValue())
            is RShort -> this.value.compareTo(other.shortValue())
            is RInt -> this.value.compareTo(other.intValue())
            is RLong -> this.value.compareTo(other.longValue())
            is RFloat -> this.value.compareTo(other.floatValue())
            is RDouble -> this.value.compareTo(other.doubleValue())

            else -> throw UnsupportedOperationException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }.asRuntimeValue()
    }
}

data class DoubleValue(override val value: Double) : NumberValue(RDouble) {
    override val type: RComparable = RDouble

    override fun compareTo(other: ComparableValue): IntValue {
        if (other.type !is RNumber) {
            throw IllegalArgumentException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }

        return when (other.type) {
            is RByte -> this.value.compareTo(other.byteValue())
            is RShort -> this.value.compareTo(other.shortValue())
            is RInt -> this.value.compareTo(other.intValue())
            is RLong -> this.value.compareTo(other.longValue())
            is RFloat -> this.value.compareTo(other.floatValue())
            is RDouble -> this.value.compareTo(other.doubleValue())

            else -> throw UnsupportedOperationException("Cannot compare ${other.type.qualifiedName} with type ${this.type.qualifiedName}")
        }.asRuntimeValue()
    }
}

object UnitValue : RuntimeValue {
    override val type: RType = RUnit
    override val value = Unit
}
