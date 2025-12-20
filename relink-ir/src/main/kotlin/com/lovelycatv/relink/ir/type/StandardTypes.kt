/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.ir.type

object RString : RCharSequence() {
    override val simpleName = "String"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RString
    }
}

object RBoolean : RType() {
    override val simpleName: String get() = "RBoolean"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RBoolean
    }
}

object RChar : RType() {
    override val simpleName: String get() = "RChar"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RChar
    }
}

object RByte : RNumber() {
    override val simpleName: String get() = "RByte"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RByte
    }

    override fun isComparableTo(other: RComparable): Boolean {
        return other is RNumber
    }
}

object RShort : RNumber() {
    override val simpleName: String get() = "RShort"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RShort
    }

    override fun isComparableTo(other: RComparable): Boolean {
        return other is RNumber
    }
}

object RInt : RNumber() {
    override val simpleName: String get() = "RInt"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RInt
    }

    override fun isComparableTo(other: RComparable): Boolean {
        return other is RNumber
    }
}

object RLong : RNumber() {
    override val simpleName: String get() = "RLong"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RLong
    }

    override fun isComparableTo(other: RComparable): Boolean {
        return other is RNumber
    }
}

object RFloat : RNumber() {
    override val simpleName: String get() = "RFloat"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RFloat
    }

    override fun isComparableTo(other: RComparable): Boolean {
        return other is RNumber
    }
}

object RDouble : RNumber() {
    override val simpleName: String get() = "RDouble"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RDouble
    }

    override fun isComparableTo(other: RComparable): Boolean {
        return other is RNumber
    }
}

object RUnit : RType() {
    override val simpleName: String get() = "RUnit"
    override val qualifiedName: String = this.simpleName

    override fun isAssignableFrom(other: RType): Boolean {
        return other is RUnit
    }
}