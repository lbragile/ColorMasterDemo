import React, { useEffect, useRef, useState } from "react";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import CM, { ColorMaster } from "colormaster";
import { Divider } from "semantic-ui-react";
import useCanvasContext from "../../hooks/useCanvasContext";
import CanvasGroup from "../CanvasGroup";

interface ISketchPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  pickerRadius?: number;
}

export default function SketchPicker({ color, setColor, pickerRadius = 5 }: ISketchPicker): JSX.Element {
  const colorSketch = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [sketchColor, setSketchColor] = useState(color);
  const [mouse, setMouse] = useState({ x: -1, y: -1 });

  const [ctxSketch, ctxPicker] = useCanvasContext(colorSketch, colorPicker);

  useEffect(() => {
    if (ctxSketch) {
      const { width } = ctxSketch.canvas;

      ctxSketch.fillStyle = sketchColor.stringRGB();
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
  }, [sketchColor, ctxSketch]);

  useEffect(() => {
    if (ctxPicker) {
      const { width } = ctxPicker.canvas;

      if (mouse.x === -1) setMouse({ x: width - 1, y: 0 });
      if (mouse.x < width && mouse.y < width) {
        ctxPicker.clearRect(0, 0, width, width);
        ctxPicker.beginPath();

        ctxPicker.lineWidth = 2;
        ctxPicker.arc(mouse.x, mouse.y, pickerRadius * 2, 0, 2 * Math.PI);
        ctxPicker.strokeStyle = "white";
        ctxPicker.stroke();
      }
    }
  }, [mouse, pickerRadius, ctxPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDrag.current && ctxSketch) {
      const { left, top } = ctxSketch.canvas.getBoundingClientRect();
      const [x, y] = [e.clientX - left, e.clientY - top];
      const data = ctxSketch.getImageData(x, y, 1, 1).data.slice(0, -1);
      setColor(
        CM(`rgb(${data.join(", ")})`)
          .hueTo(sketchColor.hue)
          .alphaTo(color.alpha)
      ); // maintain hue of the sketch
      setMouse({ x, y });
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

      <HuePicker height={15} color={color} setColor={setColor} setSketchColor={setSketchColor} />

      <AlphaPicker height={15} color={color} setColor={setColor} />
    </>
  );
}
