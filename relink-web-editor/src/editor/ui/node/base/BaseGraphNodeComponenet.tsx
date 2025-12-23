/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import type {ClassicScheme, RenderEmit} from "rete-react-plugin";
import {css} from "styled-components";
import * as React from "react";
import {useRef} from "react";
import classNames from "classnames";
import type {RelinkGraphSchemes} from "@/editor/types";
import {useNodeSize} from "@/rete/utils/react.ts";

type Props<S extends ClassicScheme> = {
  data: S["Node"];
  styles?: () => ReturnType<typeof css>;
  emit: RenderEmit<any>;
} & React.HTMLProps<HTMLDivElement>;

export function BaseGraphNodeComponent<S extends RelinkGraphSchemes>(props: Props<S>) {
  const ref = useRef<HTMLDivElement>(null);

  useNodeSize(ref, props.data, props.emit);

  return <div ref={ref} className={`base-graph-node ${props.className} ${classNames({"base-graph-node--selected": props.data.selected})}`}>
    {props.children}
  </div>;
}