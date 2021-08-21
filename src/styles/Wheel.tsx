import styled from "styled-components";

export const CanvasContainer = styled.div.attrs((props: { radius: number }) => props)`
  position: relative;
  height: ${(props) => (props.radius * 2 ?? 400) + "px"};

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

export const Swatch = styled.svg.attrs((props: { width: number; height: number; fill: string }) => ({
  style: { fill: props.fill } // this changes a lot
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
