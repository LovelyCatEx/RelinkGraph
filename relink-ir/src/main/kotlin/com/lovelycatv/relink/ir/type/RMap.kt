/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.type

class RMap(
    val keyType: RType,
    val valueType: RType
) : RType() {
    override val simpleName: String
        get() = "RMap<${keyType.simpleName},${valueType.simpleName}>"

    override val qualifiedName: String
        get() = "RMap<${keyType.qualifiedName},${valueType.qualifiedName}>"

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RMap && keyType == other.keyType
    }
}