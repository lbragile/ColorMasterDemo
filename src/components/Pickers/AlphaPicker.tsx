import React, { useContext, useEffect, useRef } from "react";
import CM, { ColorMaster } from "colormaster";
import useCanvas from "../../hooks/useCanvas";
import { drawCheckeredBackground } from "../../utils/alphaBackground";
import CanvasGroup from "../CanvasGroup";
import { ThemeContext } from "styled-components";

interface IAlphaPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  thickness?: number;
  vertical?: boolean;
}

export default function AlphaPicker({ color, setColor, thickness = 15, vertical = true }: IAlphaPicker): JSX.Element {
  const themeContext = useContext(ThemeContext);
  const canDrag = useRef(false);

  const [refAlpha, ctxAlpha] = useCanvas(thickness, vertical);
  const [refPicker, ctxPicker] = useCanvas(thickness, vertical);

  useEffect(() => {
    if (ctxAlpha) {
      const { width, height } = ctxAlpha.canvas;
      ctxAlpha.clearRect(0, 0, width, height);
      ctxAlpha.beginPath();
      drawCheckeredBackground(ctxAlpha, themeContext, vertical);

      ctxAlpha.rect(0, 0, width, height);
      const gradient = ctxAlpha.createLinearGradient(0, 0, vertical ? 0 : width, vertical ? height : 0);
      const { r, g, b } = color.rgba();
      gradient.addColorStop(vertical ? 1 : 0, `rgba(${r}, ${g}, ${b}, 0)`);
      gradient.addColorStop(vertical ? 0 : 1, `rgba(${r}, ${g}, ${b}, 1)`);
      ctxAlpha.fillStyle = gradient;
      ctxAlpha.fill();
    }
  }, [color, vertical, ctxAlpha, themeContext]);

  useEffect(() => {
    if (ctxPicker) {
      const { width, height } = ctxPicker.canvas;

      ctxPicker.clearRect(0, 0, width, height);
      ctxPicker.beginPath();

      const x = vertical ? width / 2 : color.alpha * width;
      const y = vertical ? (1 - color.alpha) * height : height / 2;
      const r = thickness / 2 - 1;
      ctxPicker.arc(x, y, r, 0, 2 * Math.PI);

      ctxPicker.lineWidth = 2;
      ctxPicker.fillStyle = "hsla(0, 0%, 50%, 0.6)";
      ctxPicker.fill();
      ctxPicker.strokeStyle = "#fff";
      ctxPicker.stroke();
    }
  }, [color, vertical, thickness, ctxPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDrag.current && ctxAlpha) {
      const { width, height } = ctxAlpha.canvas;
      const { left, top } = ctxAlpha.canvas.getBoundingClientRect();
      const x = e.clientX - Math.floor(left);
      const y = e.clientY - Math.floor(top);
      const newAlpha = vertical ? 1 - y / height : x / width;
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
      mainRef={refAlpha}
      picker={{
        ref: refPicker,
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
      }}
    />
  );
}
