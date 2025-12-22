/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
export interface RType {
  qualifiedName: string;
  simpleName: string;
  isAssignableFrom: (from: RType) => boolean;
}

export interface RComparable extends RType {}

export interface RNumber extends RComparable {}

export const RELINK_TYPES_MAP = new Map<string, RType>();

function defineRType<T extends RType>(name: string, qualifiedName: string = name): T {
  if (RELINK_TYPES_MAP.has(qualifiedName)) {
    throw new Error(`An RType with qualifiedName ${qualifiedName} is already defined.`);
  }

  const type = {
    qualifiedName: qualifiedName,
    simpleName: name,
    isAssignableFrom: (from) => from.qualifiedName == qualifiedName,
  } as T;

  RELINK_TYPES_MAP.set(qualifiedName, type);

  return type;
}

export function getRType(qualifiedName: string): RType {
  if (!RELINK_TYPES_MAP.has(qualifiedName)) {
    throw new Error(`RType ${qualifiedName} is not defined.`);
  }

  return RELINK_TYPES_MAP.get(qualifiedName)!;
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