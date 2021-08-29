import styled from "styled-components";

// * touch-action: none → https://stackoverflow.com/a/48254578/4298115

export const CanvasContainer = styled.div.attrs((props: { width: number; height: number }) => props)`
  position: relative;
  width: ${(props) => (props.width ?? 400) + "px"};
  height: ${(props) => (props.height ?? 400) + "px"};
  touch-action: none;
  background: transparent;
  margin: auto;

  & canvas {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    &:first-child {
      z-index: 0;
    }

    &:last-child {
      cursor: crosshair;
      z-index: 1;
    }
  }
`;
