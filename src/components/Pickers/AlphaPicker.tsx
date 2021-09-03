import React, { useEffect, useRef } from "react";
import CM, { ColorMaster } from "colormaster";
import useCanvasContext from "../../hooks/useCanvasContext";
import { drawCheckeredBackground } from "../../utils/alphaBackground";
import CanvasGroup from "../CanvasGroup";

interface IAlphaPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  height?: number;
}

export default function AlphaPicker({ color, setColor, height = 15 }: IAlphaPicker): JSX.Element {
  const colorAlpha = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [ctxAlpha, ctxPicker] = useCanvasContext(colorAlpha, colorPicker, height);

  useEffect(() => {
    if (ctxAlpha) {
      const { width } = ctxAlpha.canvas;
      ctxAlpha.clearRect(0, 0, width, height);
      ctxAlpha.beginPath();
      drawCheckeredBackground(ctxAlpha);

      ctxAlpha.rect(0, 0, width, height);
      const gradient = ctxAlpha.createLinearGradient(0, 0, width, 0);
      const { r, g, b } = color.rgba();
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
      ctxAlpha.fillStyle = gradient;
      ctxAlpha.fill();
    }
  }, [height, color, ctxAlpha]);

  useEffect(() => {
    if (ctxPicker) {
      const { width } = ctxPicker.canvas;

      ctxPicker.clearRect(0, 0, width, height);
      ctxPicker.beginPath();
      ctxPicker.arc(color.alpha * width, height / 2, height / 2 - 1, 0, 2 * Math.PI);

      ctxPicker.lineWidth = 2;
      ctxPicker.fillStyle = "hsla(0, 0%, 50%, 0.6)";
      ctxPicker.fill();
      ctxPicker.strokeStyle = "#fff";
      ctxPicker.stroke();
    }
  }, [height, color, ctxPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDrag.current && ctxAlpha) {
      const { width } = ctxAlpha.canvas;
      const { left } = ctxAlpha.canvas.getBoundingClientRect();
      const newAlpha = (e.clientX - Math.floor(left)) / (width - 1);
      const currentColor = CM(color.rgba()); // deep clone the `color` state variable
      setColor(currentColor.alphaTo(newAlpha));
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  return (
    <CanvasGroup
      height={height}
      mainRef={colorAlpha}
      picker={{
        ref: colorPicker,
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
      }}
    />
  );
}
