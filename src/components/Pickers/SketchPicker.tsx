import React, { useEffect, useRef } from "react";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import useCanvas from "../../hooks/useCanvas";
import CanvasGroup from "../CanvasGroup";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import HSVPlugin from "colormaster/plugins/hsv";
import { FadeIn } from "../../styles/Fade";
import { TSetState } from "../../types/react";

extendPlugins([HSVPlugin]);

interface ISketchPicker {
  color: ColorMaster;
  setColor: TSetState<ColorMaster>;
  pickerRadius?: number;
  vertical?: boolean;
}

/**
 * For a sketch picker, there are three main channels:
 * - Hue (dominant color)
 * - Saturation (x-axis) - pigmentation of the color
 * - Brightness/Value (y-axis) - light to dark
 *
 * Thus, HSB/HSV colorspace is used to calculate the position of the cursor on the canvas
 */
export default function SketchPicker({
  color,
  setColor,
  pickerRadius = 5,
  vertical = true
}: ISketchPicker): JSX.Element {
  const canDrag = useRef(false);

  const [refSketch, ctxSketch] = useCanvas();
  const [refPicker, ctxPicker] = useCanvas();

  useEffect(() => {
    if (ctxSketch) {
      const { width } = ctxSketch.canvas;

      ctxSketch.fillStyle = `hsla(${color.hue}, 100%, 50%, 1)`;
      ctxSketch.fillRect(0, 0, width, width);

      const whiteGradient = ctxSketch.createLinearGradient(0, 0, width, 0);
      whiteGradient.addColorStop(0, "rgba(255,255,255,1)");
      whiteGradient.addColorStop(1, "rgba(255,255,255,0)");
      ctxSketch.fillStyle = whiteGradient;
      ctxSketch.fillRect(0, 0, width, width);

      const blackGradient = ctxSketch.createLinearGradient(0, 0, 0, width);
      blackGradient.addColorStop(0, "rgba(0,0,0,0)");
      blackGradient.addColorStop(1, "rgba(0,0,0,1)");
      ctxSketch.fillStyle = blackGradient;
      ctxSketch.fillRect(0, 0, width, width);
    }
  }, [color, ctxSketch]);

  useEffect(() => {
    if (ctxPicker) {
      const { width } = ctxPicker.canvas;

      ctxPicker.clearRect(0, 0, width, width);
      ctxPicker.beginPath();

      const { s, v } = color.hsva();
      ctxPicker.arc((s * width) / 100, ((100 - v) * width) / 100, pickerRadius * 1.5, 0, 2 * Math.PI);
      ctxPicker.lineWidth = 2;
      ctxPicker.strokeStyle = "white";
      ctxPicker.stroke();
    }
  }, [color, pickerRadius, ctxPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDrag.current && ctxSketch) {
      const { width } = ctxSketch.canvas;
      const { left, top } = ctxSketch.canvas.getBoundingClientRect();
      const [s, v] = [e.clientX - left, e.clientY - top].map((val) => (val * 100) / width);
      setColor(CM({ ...color.hsva(), s, v: 100 - v }));
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  const CommonProps = { thickness: 15, vertical, color, setColor };

  return (
    <FadeIn $gap="8px">
      <CanvasGroup
        mainRef={refSketch}
        picker={{
          ref: refPicker,
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp
        }}
      />

      <HuePicker {...CommonProps} />
      <AlphaPicker {...CommonProps} />
    </FadeIn>
  );
}
