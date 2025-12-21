/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {BaseGraphSocket} from "@/rete/socket/BaseGraphSocket.ts";
import {ClassicPreset} from "rete";

export class ExecSocket extends BaseGraphSocket {
  constructor() {
    super("Exec");
  }

  isCompatibleWith(socket: ClassicPreset.Socket): boolean {
    return socket instanceof ExecSocket;
  }
}