/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.type

class RArray(
    val elementType: RType
) : RType() {
    override val simpleName: String
        get() = "${elementType.simpleName}[]"

    override val qualifiedName: String
        get() = "${elementType.qualifiedName}[]"

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RArray && this.elementType == other.elementType
    }
}