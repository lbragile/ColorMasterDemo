import React, { useEffect, useRef } from "react";
import CM, { ColorMaster } from "colormaster";
import useCanvasContext from "../../hooks/useCanvasContext";
import CanvasGroup from "../CanvasGroup";

interface IHuePicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  height?: number;
}

export default function HuePicker({ color, setColor, height = 25 }: IHuePicker): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [ctxHue, ctxPicker] = useCanvasContext(colorHue, colorPicker, height);

  useEffect(() => {
    if (ctxHue) {
      const { width } = ctxHue.canvas;

      ctxHue.clearRect(0, 0, width, height);
      ctxHue.rect(0, 0, width, height);
      const gradient = ctxHue.createLinearGradient(0, 0, width, 0);
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
  }, [height, color, ctxHue]);

  useEffect(() => {
    if (ctxPicker) {
      const { width } = ctxPicker.canvas;

      ctxPicker.clearRect(0, 0, width, height);
      ctxPicker.beginPath();

      ctxPicker.arc((color.hue * width) / 360, height / 2, height / 2 - 1, 0, 2 * Math.PI);

      ctxPicker.lineWidth = 2;
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
    if (canDrag.current && ctxHue) {
      const { width } = ctxHue.canvas;

      const { left, top } = ctxHue.canvas.getBoundingClientRect();
      const [x, y] = [e.clientX - Math.floor(left), e.clientY - Math.floor(top)];

      const data = ctxHue.getImageData(x === width ? x - 1 : x, y === height ? y - 1 : y, 1, 1).data.slice(0, -1);
      const newColor = CM(`rgba(${data.join(", ")}, ${color.alpha})`);

      setColor(CM({ ...color.hsla(), h: newColor.hue }));
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
