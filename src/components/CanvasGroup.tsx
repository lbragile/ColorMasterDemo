import React from "react";
import { CanvasContainer } from "../styles/Canvas";

type TCanvasRef = React.RefObject<HTMLCanvasElement>;

interface IPicker {
  ref: TCanvasRef;
  onPointerDown: (e: React.MouseEvent) => void;
  onPointerMove: (e: React.MouseEvent) => void;
  onPointerUp: (e: React.MouseEvent) => void;
}

interface ICanvasGroup {
  mainRef: TCanvasRef;
  picker: IPicker;
  borderRadius?: string;
}

export default function CanvasGroup({ mainRef, picker, borderRadius }: ICanvasGroup): JSX.Element {
  return (
    <CanvasContainer $borderRadius={borderRadius}>
      <canvas ref={mainRef}></canvas>
      <canvas {...picker}></canvas>
    </CanvasContainer>
  );
}
