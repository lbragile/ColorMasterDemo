import styled from "styled-components";

// * touch-action: none → https://stackoverflow.com/a/48254578/4298115

export const CanvasContainer = styled.div.attrs((props: { height?: number }) => props)`
  display: grid;

  touch-action: none;
  background: transparent;

  & canvas {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    margin: auto;

    &:first-child {
      z-index: 0;
    }

    &:last-child {
      cursor: crosshair;
      z-index: 1;
    }
  }
`;
