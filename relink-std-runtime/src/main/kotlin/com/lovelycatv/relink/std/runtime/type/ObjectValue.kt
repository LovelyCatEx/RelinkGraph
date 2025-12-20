/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.runtime.type

import com.lovelycatv.relink.std.ir.type.RClass

data class ObjectValue(
    override val type: RClass,
    override val value: Any
) : RuntimeValue