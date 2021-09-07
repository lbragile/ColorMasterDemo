import React, { useEffect, useRef } from "react";
import CM, { ColorMaster } from "colormaster";
import useCanvasContext from "../../hooks/useCanvasContext";
import CanvasGroup from "../CanvasGroup";

interface IHuePicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  thickness?: number;
  vertical?: boolean;
}

export default function HuePicker({ color, setColor, thickness = 25, vertical = true }: IHuePicker): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [ctxHue, ctxPicker] = useCanvasContext(colorHue, colorPicker, thickness, vertical);

  useEffect(() => {
    if (ctxHue) {
      const { width, height } = ctxHue.canvas;

      ctxHue.clearRect(0, 0, width, height);
      ctxHue.rect(0, 0, width, height);
      const gradient = ctxHue.createLinearGradient(0, 0, vertical ? 0 : width, vertical ? height : 0);
      const a = color.alpha;
      gradient.addColorStop(0, `rgba(255, 0, 0, ${a})`);
      gradient.addColorStop(0.17, `rgba(255, 255, 0, ${a})`);
      gradient.addColorStop(0.34, `rgba(0, 255, 0, ${a})`);
      gradient.addColorStop(0.51, `rgba(0, 255, 255, ${a})`);
      gradient.addColorStop(0.68, `rgba(0, 0, 255, ${a})`);
      gradient.addColorStop(0.85, `rgba(255, 0, 255, ${a})`);
      gradient.addColorStop(1, `rgba(255, 0, 0, ${a})`);
      ctxHue.fillStyle = gradient;
      ctxHue.fill();
    }
  }, [color, vertical, ctxHue]);

  useEffect(() => {
    if (ctxPicker) {
      const { width, height } = ctxPicker.canvas;

      ctxPicker.clearRect(0, 0, width, height);
      ctxPicker.beginPath();

      const x = vertical ? width / 2 : (color.hue / 360) * width;
      const y = vertical ? (color.hue / 360) * height : height / 2;
      const r = thickness / 2 - 1;
      ctxPicker.arc(x, y, r, 0, 2 * Math.PI);

      ctxPicker.lineWidth = 2;
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
    if (canDrag.current && ctxHue) {
      const { width, height } = ctxHue.canvas;
      const { left, top } = ctxHue.canvas.getBoundingClientRect();
      const x = e.clientX - Math.floor(left);
      const y = e.clientY - Math.floor(top);
      const newHue = vertical ? (y * 360) / height : (x * 360) / width;
      setColor(CM({ ...color.hsla(), h: newHue }));
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  return (
    <CanvasGroup
      className="hue"
      mainRef={colorHue}
      picker={{
        ref: colorPicker,
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
      }}
    />
  );
}
