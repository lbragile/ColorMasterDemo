import React from "react";
import styled from "styled-components";

const Horizontal = styled.span.attrs((props: { $width: string }) => props)`
  margin: ${(props) => "0 " + props.$width ?? "0"};
`;

const Vertical = styled.div.attrs((props: { $height: string }) => props)`
  height: ${(props) => props.$height ?? "0"};
`;

export default function Spacers({ width, height }: { width?: string; height?: string }): JSX.Element {
  return width ? <Horizontal $width={width} /> : <Vertical $height={height} />;
}
