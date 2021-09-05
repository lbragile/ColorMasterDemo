import React from "react";

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
  className?: string;
}

export default function CanvasGroup({ className, mainRef, picker }: ICanvasGroup): JSX.Element {
  return (
    <>
      <canvas className={className} ref={mainRef}></canvas>
      <canvas className={className} {...picker}></canvas>
    </>
  );
}
