import styled from "styled-components";

export const CanvasContainer = styled.div.attrs((props: { height: number }) => props)`
  position: relative;
  height: ${(props) => (props.height ?? 400) + "px"};

  & canvas {
    position: absolute;
    top: 0;
    left: 0;

    &:first-child {
      z-index: 0;
    }

    &:last-child {
      cursor: crosshair;
      z-index: 1;
    }
  }
`;
