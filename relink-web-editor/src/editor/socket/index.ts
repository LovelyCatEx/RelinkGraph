/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {ExecSocket} from "./ExecSocket.ts";
import {ParamSocket} from "./ParamSocket.ts";

export type RelinkGraphSocket = ExecSocket | ParamSocket;

export const execSocket = new ExecSocket()
export const paramSocket = new ParamSocket()