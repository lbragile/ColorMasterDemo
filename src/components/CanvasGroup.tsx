import React from "react";
import styled from "styled-components";

type TCanvasRef = React.RefObject<HTMLCanvasElement>;

interface IPicker {
  ref: TCanvasRef;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

interface ICanvasGroup {
  mainRef: TCanvasRef;
  picker: IPicker;
  className?: string;
}

// * touch-action: none → https://stackoverflow.com/a/48254578/4298115

const GroupContainer = styled.div.attrs((props: { $canvas: HTMLCanvasElement | null }) => props)`
  position: relative;
  height: ${(props) => (props.$canvas?.height ?? 300) + "px"};
  width: ${(props) => (props.$canvas?.width ?? 300) + "px"};

  & canvas {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    cursor: crosshair;
    touch-action: none;
    background: transparent;

    &:not(.wheel) {
      border: 1px solid ${(props) => props.theme.colors.borderLight};
    }
  }
`;

export default function CanvasGroup({ className, mainRef, picker }: ICanvasGroup): JSX.Element {
  return (
    <GroupContainer $canvas={mainRef.current}>
      <canvas className={className} ref={mainRef}></canvas>
      <canvas className={className} {...picker}></canvas>
    </GroupContainer>
  );
}
