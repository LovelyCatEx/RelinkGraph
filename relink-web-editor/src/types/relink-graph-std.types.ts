/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import type {IrBaseNode} from "@/types/relink-graph.types.ts";
import type {RComparable, RNumber, RType} from "@/types/relink-ir.types.ts";

export enum StdNodeType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  ADD = 'ADD',
  SUB = 'SUB',
  MUL = 'MUL',
  DIV = 'DIV',
  IF = 'IF',
  COMPARATOR = 'COMPARATOR',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  EQ = 'EQ',
  CONST = 'CONST',
}

export interface IrConstNode extends IrBaseNode {
  constValue: {
    type: RType;
    value: any;
  }
}

export interface IrAddNode extends IrBaseNode {
  operandType: RNumber;
}

export interface IrSubNode extends IrBaseNode {
  operandType: RNumber;
}

export interface IrMulNode extends IrBaseNode {
  operandType: RNumber;
}

export interface IrDivNode extends IrBaseNode {
  operandType: RNumber;
}

export interface IrAddNode extends IrBaseNode {
  operandType: RNumber;
}

export interface IrGTNode extends IrBaseNode {
  operandType: RComparable;
}

export interface IrGTENode extends IrBaseNode {
  operandType: RComparable;
}

export interface IrLTNode extends IrBaseNode {
  operandType: RComparable;
}

export interface IrLTENode extends IrBaseNode {
  operandType: RComparable;
}

export interface IrEQNode extends IrBaseNode {
  operandType: RComparable;
}