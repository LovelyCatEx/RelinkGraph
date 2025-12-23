/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
export interface RType {
  superClass?: RType;
  qualifiedName: string;
  simpleName: string;
  isAssignableFrom: (from: RType) => boolean;
}

export const RAny: RType = {
  qualifiedName: 'RAny',
  simpleName: 'RAny',
  isAssignableFrom: (_) => true,
}

export interface RComparable extends RType {
}

export interface RNumber extends RComparable {}

export const RELINK_TYPES_MAP = new Map<string, RType>();

function defineRType<T extends RType>(name: string, qualifiedName: string = name, superClass: RType = RAny): T {
  if (RELINK_TYPES_MAP.has(qualifiedName)) {
    throw new Error(`An RType with qualifiedName ${qualifiedName} is already defined.`);
  }

  const type = {
    superClass: superClass,
    qualifiedName: qualifiedName,
    simpleName: name,
    isAssignableFrom: (from) => {
      let isFromSubClass = false;
      let fromSuperClass = from.superClass;
      while (fromSuperClass) {
        if (fromSuperClass.qualifiedName === qualifiedName) {
          isFromSubClass = true;
          break;
        } else {
          fromSuperClass = fromSuperClass.superClass;
        }
      }

      return from.qualifiedName == qualifiedName || isFromSubClass;
    },
  } as T;

  RELINK_TYPES_MAP.set(qualifiedName, type);

  return type;
}

const RTypeKeys = ['qualifiedName', 'simpleName', 'superClass', 'isAssignableFrom'];
export function isRType(target: any) {
  const keys = Object.keys(target);
  return RTypeKeys.all((it) => keys.includes(it));
}

export function getRType(qualifiedName: string): RType {
  if (!RELINK_TYPES_MAP.has(qualifiedName)) {
    throw new Error(`RType ${qualifiedName} is not defined.`);
  }

  return RELINK_TYPES_MAP.get(qualifiedName)!;
}

export const RNumber = defineRType<RType>('RNumber', 'RNumber', RAny);

export const RChar = defineRType<RType>('RChar', 'RChar', RAny);
export const RByte = defineRType<RType>('RByte', 'RByte', RAny);

export const RShort = defineRType<RNumber>('RShort', 'RShort', RNumber);
export const RInt = defineRType<RNumber>('RInt', 'RInt', RNumber);
export const RLong = defineRType<RNumber>('RLong', 'RLong', RNumber);
export const RFloat = defineRType<RNumber>('RFloat', 'RFloat', RNumber);
export const RDouble = defineRType<RNumber>('RDouble', 'RDouble', RNumber);

export const RBoolean = defineRType<RType>('RBoolean', 'RBoolean', RAny);
export const RString = defineRType<RType>('RString', 'RString', RAny);

export function rTypeInstanceOf(a: RType, b: RType) {
  return b.isAssignableFrom(a);
}