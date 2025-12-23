/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {BaseRelinkGraphNodeControl} from "@/editor/control/BaseRelinkGraphNodeControl.ts";
import type {PortLabel} from "@/types/relink-graph.types.ts";

export function getIOControls(node: BaseRelinkGraphNode): {
  inputControls: [string, BaseRelinkGraphNodeControl][],
  outputControls: [string, BaseRelinkGraphNodeControl][],
  getCorrespondingControl: (type: 'in' | 'out', label: PortLabel) => [string, BaseRelinkGraphNodeControl] | undefined
} {
  const inputControls = Object.entries(node.controls)
    .filter(([key]) => key.startsWith('in::'));
  const outputControls = Object.entries(node.controls)
    .filter(([key]) => key.startsWith('out::'));

  const getCorrespondingControl = (type: 'in' | 'out', label: PortLabel) => {
    if (type == 'in') {
      return inputControls.find(([k, _]) => k == `in::${label}`);
    } else if (type === 'out') {
      return outputControls.find(([k, _]) => k == `out::${label}`);
    } else {
      return undefined;
    }
  }

  return {
    inputControls,
    outputControls,
    getCorrespondingControl
  }
}