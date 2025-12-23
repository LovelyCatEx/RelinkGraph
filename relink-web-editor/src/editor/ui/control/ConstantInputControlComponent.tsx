/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import type {InputRelinkGraphNodeControl} from "@/editor/control/InputRelinkGraphNodeControl.ts";
import type {IrConstNode} from "@/types/relink-graph-std.types.ts";
import {useState} from "react";
import {
  getRType,
  isRType,
  RBoolean, RByte,
  RChar,
  RNumber,
  RString,
  type RType,
  rTypeInstanceOf
} from "@/types/relink-ir.types.ts";
import {Checkbox, Input} from "antd";
import TextArea from "antd/lib/input/TextArea";

export function ConstantInputControlComponent(data: InputRelinkGraphNodeControl) {
  const constNode = data.node.node as IrConstNode;

  let type: RType;
  if (isRType(constNode.constValue.type)) {
    type = constNode.constValue.type;
  } else {
    type = getRType(constNode.constValue.type as unknown as string);
  }

  const [value, setValue] = useState<string>(constNode.constValue.value.toString());

  if (rTypeInstanceOf(type, RNumber)) {

    return <Input
      className="max-w-24"
      value={value}
      type="number"
      onChange={(e) => {
        e.stopPropagation();
        const v = e.currentTarget.value;
        setValue(v);
        data.onValuedChanged(v);
      }}
      onPointerDown={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    />;
  } if (rTypeInstanceOf(type, RBoolean)) {
    return <Checkbox
      checked={value == 'true'}
      onChange={(e) => {
        e.stopPropagation();
        const v = e.target.checked;
        setValue(v.toString());
        data.onValuedChanged(v.toString());
      }}
      // @ts-ignore
      onPointerDown={e => e.stopPropagation()}
      // @ts-ignore
      onPointerUp={e => e.stopPropagation()}
      // @ts-ignore
      onClick={e => e.stopPropagation()}
      // @ts-ignore
      onMouseDown={e => e.stopPropagation()}
      // @ts-ignore
      onMouseUp={e => e.stopPropagation()}
    />;
  } if (rTypeInstanceOf(type, RString)) {
    return <TextArea
      value={value}
      onChange={(e) => {
        e.stopPropagation();
        const v = e.currentTarget.value;
        setValue(v);
        data.onValuedChanged(v);
      }}
      onPointerDown={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    />;
  } if (rTypeInstanceOf(type, RChar)) {
    return <Input
      className="max-w-12"
      value={value}
      onChange={(e) => {
        e.stopPropagation();
        const v = e.currentTarget.value;
        if (v.length > 1) {
          return;
        }
        setValue(v);
        data.onValuedChanged(v);
      }}
      onPointerDown={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    />;
  } if (rTypeInstanceOf(type, RByte)) {
    return <Input
      className="max-w-12"
      value={value}
      type="number"
      onChange={(e) => {
        e.stopPropagation();
        const v = e.currentTarget.value;
        setValue(v);
        data.onValuedChanged(v);
      }}
      onPointerDown={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    />;
  } else {
    return <div>UNSUPPORTED DATA TYPE ${type.qualifiedName}</div>
  }
}