/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 *
 */
package com.lovelycatv.relink.std.ir

import com.lovelycatv.relink.ir.workflow.node.INodeType

enum class StdNodeType : INodeType {
    ENTRY,
    EXIT,
    CONST,
    ADD,
    SUB,
    MUL,
    DIV,
    COMPARATOR,
    GT,
    LT,
    EQ,
    GTE,
    LTE,
    IF,
    TO_STRING,
    TO_BYTE,
    TO_CHAR,
    TO_SHORT,
    TO_INT,
    TO_LONG,
    TO_FLOAT,
    TO_DOUBLE,
    TO_BOOLEAN;

    override fun getTypeName(): String {
        return this.name
    }
}