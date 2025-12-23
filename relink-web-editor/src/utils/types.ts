/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
export function stringToRealType(str: string): string | number | boolean {
  const s = str.trim();

  // boolean
  if (s.toLowerCase() === 'true') {
    return true;
  }
  if (s.toLowerCase() === 'false') {
    return false;
  }

  // number（整数 / 小数 / 负数）
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    return Number(s);
  }

  // fallback：string
  return str;
}
