/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.utils

import kotlinx.serialization.json.Json

val DefaultJson = Json {
    encodeDefaults = true
    ignoreUnknownKeys = true
    explicitNulls = false
}

inline fun <reified T> T.toJSONString(json: Json = DefaultJson): String {
    return json.encodeToString(this)
}

inline fun <reified T> String.parseObject(json: Json = DefaultJson): T {
    return json.decodeFromString(this)
}