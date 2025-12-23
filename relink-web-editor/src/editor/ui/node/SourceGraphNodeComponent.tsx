/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {type ClassicScheme, Presets, type RenderEmit} from "rete-react-plugin";
import {css} from "styled-components";
import './base/base-graph-node.styles.css';
import './source-graph-node.styles.css';
import {SquareFunction} from "lucide-react";
import type {RelinkGraphSchemes} from "@/editor/types";
import {getIOControls} from "@/rete/utils/control-utils.ts";
import {BaseGraphNodeComponent} from "@/editor/ui/node/base/BaseGraphNodeComponenet.tsx";

const { RefSocket, RefControl  } = Presets.classic;

type Props<S extends ClassicScheme> = {
  data: S["Node"];
  styles?: () => ReturnType<typeof css>;
  emit: RenderEmit<any>;
};

export function SourceGraphNodeComponent<S extends RelinkGraphSchemes>(props: Props<S>) {
  const inputs = Object.entries(props.data.inputs);
  const outputs = Object.entries(props.data.outputs);

  const { getCorrespondingControl} = getIOControls(props.data);

  return (
    <BaseGraphNodeComponent
      className="source-graph-node"
      // @ts-ignore
      data={props.data}
      emit={props.emit}
    >
      <div className="header flex flex-col text-white pl-4 pr-4 pt-2 pb-2">
        <div className="flex flex-row items-center space-x-2">
          <SquareFunction size="28" />
          <div className="title">{props.data.node.nodeId} ({props.data.node.nodeType})</div>
        </div>
      </div>

      <div className="flex flex-row justify-between p-4 space-x-4">
        <div className="">
          {/* Inputs */}
          {inputs.map(([key, input]) => (
            input && (
                <div className="input" key={key}>
                  <RefSocket
                    name="input-socket"
                    side="input"
                    socketKey={key}
                    nodeId={props.data.id}
                    emit={props.emit}
                    payload={input.socket}
                    data-testid="input-socket"
                  />
              </div>
            )
          ))}
        </div>
        <div className="">
          {/* Outputs */}
          {outputs.map(([key, output]) => (
            output && (
              <div className="output flex flex-row space-x-2 items-center" key={key}>
                {(() => {
                  const control = getCorrespondingControl('out', output!.label ?? '');
                  if (!control) {
                    return <></>;
                  }

                  const [key, component] = control;
                  return control && <RefControl
                    key={key}
                    payload={component}
                    emit={props.emit}
                    name={"input-control"}
                  />
                })()}

                {output?.label && <span className="mr-2">{output?.label}</span>}
                <RefSocket
                  name="output-socket"
                  side="output"
                  socketKey={key}
                  nodeId={props.data.id}
                  emit={props.emit}
                  payload={output.socket}
                  data-testid="output-socket"
                />
              </div>
            )
          ))}
        </div>
      </div>
    </BaseGraphNodeComponent>
  )
}