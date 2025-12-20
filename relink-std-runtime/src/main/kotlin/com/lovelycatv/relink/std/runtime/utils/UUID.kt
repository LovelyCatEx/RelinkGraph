/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.utils

import kotlin.random.Random

object UUID {
    fun randomUUID(): String {
        val bytes = ByteArray(16)
        Random.nextBytes(bytes)

        bytes[6] = ((bytes[6].toInt() and 0x0F) or 0x40).toByte()

        bytes[8] = ((bytes[8].toInt() and 0x3F) or 0x80).toByte()

        val hex = CharArray(36)
        var i = 0
        var j = 0
        while (i < 16) {
            if (j == 8 || j == 13 || j == 18 || j == 23) {
                hex[j++] = '-'
            }
            val b = bytes[i++].toInt() and 0xFF
            hex[j++] = toHexChar(b ushr 4)
            hex[j++] = toHexChar(b and 0x0F)
        }
        return String(hex)
    }

    private fun toHexChar(nibble: Int): Char =
        if (nibble < 10) ('0'.code + nibble).toChar()
        else ('a'.code + (nibble - 10)).toChar()
}