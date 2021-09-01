import React, { useEffect, useRef } from "react";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import { Divider } from "semantic-ui-react";
import useCanvasContext from "../../hooks/useCanvasContext";
import CanvasGroup from "../CanvasGroup";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import HSVPlugin from "colormaster/plugins/hsv";

extendPlugins([HSVPlugin]);

interface ISketchPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  pickerRadius?: number;
}

/**
 * For a sketch picker, there are three main channels:
 * - Hue (dominant color)
 * - Saturation (x-axis) - pigmentation of the color
 * - Brightness/Value (y-axis) - light to dark
 *
 * Thus, HSB/HSV colorspace is used to calculate the position of the cursor on the canvas
 */
export default function SketchPicker({ color, setColor, pickerRadius = 5 }: ISketchPicker): JSX.Element {
  const colorSketch = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [ctxSketch, ctxPicker] = useCanvasContext(colorSketch, colorPicker);

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

      // draw a faint border around the sketch picker
      ctxSketch.beginPath();
      ctxSketch.strokeStyle = "hsla(0, 0%, 90%, 1)";
      ctxSketch.strokeRect(0, 0, width, width);
    }
  }, [color, ctxSketch]);

  useEffect(() => {
    if (ctxPicker) {
      const { width } = ctxPicker.canvas;

      ctxPicker.clearRect(0, 0, width, width);
      ctxPicker.beginPath();

      const { s, v } = color.hsva();
      ctxPicker.arc((s / 100) * (width - 1), (1 - v / 100) * (width - 1), pickerRadius * 2, 0, 2 * Math.PI);
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
      const { left, top } = ctxSketch.canvas.getBoundingClientRect();
      const [s, v] = [e.clientX - left, e.clientY - top].map((val) => (val * 100) / ctxSketch.canvas.width);

      setColor(CM(`hsva(${color.hue}, ${s}%, ${100 - v}%, ${color.alpha})`));
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  return (
    <>
      <CanvasGroup
        mainRef={colorSketch}
        picker={{
          ref: colorPicker,
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp
        }}
      />

      <Divider hidden></Divider>

      <HuePicker height={15} color={color} setColor={setColor} />

      <AlphaPicker height={15} color={color} setColor={setColor} />
    </>
  );
}
