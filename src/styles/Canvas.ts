import styled from "styled-components";

// * touch-action: none → https://stackoverflow.com/a/48254578/4298115

export const CanvasContainer = styled.div.attrs(
  (props: { $thickness?: number; $vertical?: boolean; $borderRadius?: string }) => props
)`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 10px;

  & .main {
    grid-row: 1;
    grid-column: 1 / span 6;
    justify-self: right;
    align-self: center;
  }

  & .hue {
    grid-row: ${(props) => (props.$vertical ? 1 : 2)};
    grid-column: ${(props) => (props.$vertical ? "7 / span 1" : "1 / span 6")};
    justify-self: right;
  }

  & .alpha {
    grid-row: ${(props) => (props.$vertical ? 1 : 3)};
    grid-column: ${(props) => (props.$vertical ? "8 / span 1" : "1 / span 6")};
    justify-self: ${(props) => (props.$vertical ? "left" : "right")};
  }

  & .alpha,
  .hue {
    border: none;
    border-radius: 4px;
    padding-right: 2px;
    align-self: center;
  }

  & canvas {
    touch-action: none;
    background: transparent;
    cursor: crosshair;
    border: 1px solid hsla(0, 0%, 90%, 1);
    border-bottom: none;

    &.main.wheel {
      border: none;
    }
  }
`;
