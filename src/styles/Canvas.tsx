import styled from "styled-components";

// * touch-action: none → https://stackoverflow.com/a/48254578/4298115

export const CanvasContainer = styled.div.attrs(
  (props: { $thickness?: number; $vertical?: boolean; $borderRadius?: string }) => props
)`
  display: grid;

  touch-action: none;
  background: transparent;

  & canvas {
    grid-column: 1/ -1;
    grid-row: 1 / -1;
    margin: auto;
    border: 1px solid hsla(0, 0%, 90%, 1);
    border-radius: ${(props) => props.$borderRadius ?? "none"};
    /* width: ${(props) => (props.$vertical ? "" : props.$thickness)}; */

    &:first-child {
      z-index: 0;
    }

    &:last-child {
      cursor: crosshair;
      z-index: 1;
    }
  }
`;
