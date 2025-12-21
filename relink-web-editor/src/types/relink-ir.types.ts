/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
export interface RType {
  qualifiedName: string;
  simpleName: string;
}

export interface RComparable extends RType {}

export interface RNumber extends RComparable {}

function defineRType<T extends RType>(name: string, qualifiedName: string = name): T {
  return {
    qualifiedName: qualifiedName,
    simpleName: name,
  } as T
}

export const RChar = defineRType<RType>('RChar')
export const RByte = defineRType<RType>('RByte')

export const RShort = defineRType<RNumber>('RShort')
export const RInt = defineRType<RNumber>('RInt')
export const RLong = defineRType<RNumber>('RLong')
export const RFloat = defineRType<RNumber>('RFloat')
export const RDouble = defineRType<RNumber>('RDouble')

export const RBoolean = defineRType<RType>('RBoolean')
export const RString = defineRType<RType>('RString')
