/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.utils

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

val DefaultObjectMapper = jacksonObjectMapper()

inline fun <reified T> T.toJSONString(json: ObjectMapper = DefaultObjectMapper): String {
    return json.writeValueAsString(this)
}

inline fun <reified T> String.parseObject(json: ObjectMapper = DefaultObjectMapper): T {
    return json.readValue<T>(this, T::class.java)
}