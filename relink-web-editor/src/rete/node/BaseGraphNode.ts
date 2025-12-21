/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {ClassicPreset} from "rete";
import {BaseGraphSocket} from "../socket/BaseGraphSocket.ts";

export abstract class BaseGraphNode<S extends BaseGraphSocket> extends ClassicPreset.Node<
  Record<string, NonNullable<S>>,
  Record<string, NonNullable<S>>,
  object
> {
  public width: number = 300;
  public height: number = 200;

  protected constructor(nodeType: string) {
    super(nodeType);
  }

  public addInputSocket(label: string, socket: S, displayName?: string) {
    this.addInput(label, new ClassicPreset.Input<S>(socket, displayName))
  }

  public removeInputSocket(label: string) {
    for (const input in this.inputs) {
      if (input == label) {
        this.removeInput(input);
      }
    }
  }

  public clearInputs() {
    for (const input in this.inputs) {
      this.removeInput(input);
    }
  }

  public addOutputSocket(label: string, socket: S, displayName?: string) {
    this.addOutput(label, new ClassicPreset.Output<S>(socket, displayName))
  }

  public removeOutputSocket(label: string) {
    for (const output in this.outputs) {
      if (output == label) {
        this.removeOutput(output);
      }
    }
  }

  public clearOutputs() {
    for (const output in this.outputs) {
      this.removeOutput(output);
    }
  }
}