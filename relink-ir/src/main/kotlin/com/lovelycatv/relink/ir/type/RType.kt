/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.type

sealed class RType {
    abstract val simpleName: String
    abstract val qualifiedName: String

    abstract fun isAssignableFrom(other: RType): Boolean

    override fun equals(other: Any?): Boolean {
        return other is RType && this.qualifiedName == other.qualifiedName
    }

    override fun hashCode(): Int {
        var result = simpleName.hashCode()
        result = 31 * result + qualifiedName.hashCode()
        return result
    }
}