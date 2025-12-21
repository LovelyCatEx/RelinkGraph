/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import * as React from "react";
import {forwardRef} from "react";
import {ContextMenuContainer} from "@/rete/ui/menu/ContextMenuContainer.tsx";

const ContextMenuContainerComponent = ContextMenuContainer()

export const ContextMenuSubItem = () => {
  return forwardRef<
    HTMLDivElement,
    React.HTMLProps<HTMLDivElement>
  >((props, ref) => {
    return <ContextMenuContainerComponent ref={ref}>
      {props.children}
    </ContextMenuContainerComponent>;
  });
}