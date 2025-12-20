/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.type

data class ConstChar(override val value: Char) : ConstValue {
    override val type: RType = RChar
}

data class ConstByte(override val value: Byte) : ConstValue {
    override val type: RType = RByte
}

data class ConstShort(override val value: Short) : ConstValue {
    override val type: RType = RShort
}

data class ConstInt(override val value: Int) : ConstValue {
    override val type: RType = RInt
}

data class ConstLong(override val value: Long) : ConstValue {
    override val type: RType = RLong
}

data class ConstFloat(override val value: Float) : ConstValue {
    override val type: RType = RFloat
}

data class ConstDouble(override val value: Double) : ConstValue {
    override val type: RType = RDouble
}

data class ConstBoolean(override val value: Boolean) : ConstValue {
    override val type: RType = RBoolean
}

data class ConstString(override val value: String) : ConstValue {
    override val type: RType = RString
}