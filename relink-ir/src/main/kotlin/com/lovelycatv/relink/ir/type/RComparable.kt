/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.type

abstract class RComparable() : RType() {
    abstract fun isComparableTo(other: RComparable): Boolean
}