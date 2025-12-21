/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {css} from "styled-components";
import {type ClassicScheme, Presets} from "rete-react-plugin";

const { Connection } = Presets.classic;

const styles = css`
    stroke: #b30000b8;
`;

export function ParamConnectionComponent(props: {
  data: ClassicScheme["Connection"] & { isLoop?: boolean };
}) {
  return <Connection {...props} styles={() => styles} />;
}