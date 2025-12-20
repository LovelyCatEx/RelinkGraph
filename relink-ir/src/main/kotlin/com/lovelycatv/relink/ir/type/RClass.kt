/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir.type

open class RClass(
    override val qualifiedName: String
) : RType() {
    override val simpleName: String get() = this.qualifiedName.substringAfterLast('.')

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RClass && this.qualifiedName == other.qualifiedName
    }
}