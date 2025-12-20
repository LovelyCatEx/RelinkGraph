/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.type

import kotlinx.serialization.Serializable

@Serializable
data class ConstChar(override val value: Char) : ConstValue {
    override val type: RType = RChar
}

@Serializable
data class ConstByte(override val value: Byte) : ConstValue {
    override val type: RType = RByte
}

@Serializable
data class ConstShort(override val value: Short) : ConstValue {
    override val type: RType = RShort
}

@Serializable
data class ConstInt(override val value: Int) : ConstValue {
    override val type: RType = RInt
}

@Serializable
data class ConstLong(override val value: Long) : ConstValue {
    override val type: RType = RLong
}

@Serializable
data class ConstFloat(override val value: Float) : ConstValue {
    override val type: RType = RFloat
}

@Serializable
data class ConstDouble(override val value: Double) : ConstValue {
    override val type: RType = RDouble
}


@Serializable
data class ConstBoolean(override val value: Boolean) : ConstValue {
    override val type: RType = RBoolean
}

@Serializable
data class ConstString(override val value: String) : ConstValue {
    override val type: RType = RString
}