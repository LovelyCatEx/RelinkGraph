/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime

import com.lovelycatv.relink.std.ir.PortLabel
import com.lovelycatv.relink.std.ir.type.*
import com.lovelycatv.relink.std.ir.workflow.node.port.ParamPort
import com.lovelycatv.relink.std.runtime.type.*

fun <V> Map<ParamPort, V>.findByLabel(label: PortLabel): V? {
    return this.entries.find { it.key.label == label }?.value
}

fun <V> Map<ParamPort, V>.filterByType(type: RType): Map<ParamPort, V> {
    return this.filter { it.key.type == type }
}

fun RuntimeValue.stringValue(): String = (this as StringValue).value

fun RuntimeValue.booleanValue(): Boolean = (this as BooleanValue).value

fun RuntimeValue.charValue(): Char = (this as CharValue).value

fun RuntimeValue.byteValue(): Byte = (this as ByteValue).value

fun RuntimeValue.shortValue(): Short = (this as ShortValue).value

fun RuntimeValue.intValue(): Int = (this as IntValue).value

fun RuntimeValue.longValue(): Long = (this as LongValue).value

fun RuntimeValue.floatValue(): Float = (this as FloatValue).value

fun RuntimeValue.doubleValue(): Double = (this as DoubleValue).value

fun String.asRuntimeValue(): StringValue = StringValue(this)

fun Boolean.asRuntimeValue(): BooleanValue = BooleanValue(this)

fun Char.asRuntimeValue(): CharValue = CharValue(this)

fun Byte.asRuntimeValue(): ByteValue = ByteValue(this)

fun Short.asRuntimeValue(): ShortValue = ShortValue(this)

fun Int.asRuntimeValue(): IntValue = IntValue(this)

fun Long.asRuntimeValue(): LongValue = LongValue(this)

fun Float.asRuntimeValue(): FloatValue = FloatValue(this)

fun Double.asRuntimeValue(): DoubleValue = DoubleValue(this)

fun <T> Array<T>.asRuntimeValue(elementType: RType, transform: (T) -> RuntimeValue): ArrayValue {
    return ArrayValue(elementType, this.map { transform(it) }.toTypedArray())
}

fun <K, V> Map<K, V>.asRuntimeValue(
    keyType: RType,
    valueType: RType,
    transform: (k: K, v: V) -> Pair<RuntimeValue, RuntimeValue>
): MapValue {
    return MapValue(
        keyType,
        valueType,
        this.map {
            transform(it.key, it.value)
        }.toMap()
    )
}

fun ConstValue.asRuntimeValue(): RuntimeValue = when (this.type) {
    RBoolean -> (this as ConstBoolean).asRuntimeValue()
    RByte -> (this as ConstByte).asRuntimeValue()
    RChar -> (this as ConstChar).asRuntimeValue()
    RDouble -> (this as ConstDouble).asRuntimeValue()
    RFloat -> (this as ConstFloat).asRuntimeValue()
    RInt -> (this as ConstInt).asRuntimeValue()
    RLong -> (this as ConstLong).asRuntimeValue()
    RShort -> (this as ConstShort).asRuntimeValue()
    RString -> (this as ConstString).asRuntimeValue()
    else -> throw UnsupportedOperationException("Unsupported const type ${this.type}")
}

fun ConstString.asRuntimeValue(): StringValue = StringValue(this.value)

fun ConstBoolean.asRuntimeValue(): BooleanValue = BooleanValue(this.value)

fun ConstChar.asRuntimeValue(): CharValue = CharValue(this.value)

fun ConstByte.asRuntimeValue(): ByteValue = ByteValue(this.value)

fun ConstShort.asRuntimeValue(): ShortValue = ShortValue(this.value)

fun ConstInt.asRuntimeValue(): IntValue = IntValue(this.value)

fun ConstLong.asRuntimeValue(): LongValue = LongValue(this.value)

fun ConstFloat.asRuntimeValue(): FloatValue = FloatValue(this.value)

fun ConstDouble.asRuntimeValue(): DoubleValue = DoubleValue(this.value)

fun Map<PortLabel, RuntimeValue>.toDisplayString(): String {
    return this.entries.joinToString(separator = ", ") { "${it.key}=(${it.value.type.qualifiedName})${it.value.value}" }
}