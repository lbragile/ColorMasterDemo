import React, { useCallback, useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import CM, { ColorMaster } from "colormaster";
import { Divider } from "semantic-ui-react";

interface ISketchPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  width?: number;
  pickerRadius?: number;
}

export default function SketchPicker({ color, setColor, width = 400, pickerRadius = 5 }: ISketchPicker): JSX.Element {
  const colorSketch = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [sketchColor, setSketchColor] = useState(color);
  const [mouse, setMouse] = useState({ x: color.alpha * (width - 1), y: 0 });

  const drawColorSketch = useCallback(() => {
    if (colorSketch.current) {
      const ctx = colorSketch.current.getContext("2d");

      if (ctx) {
        ctx.fillStyle = sketchColor.stringRGB();
        ctx.fillRect(0, 0, width, width);

        const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, "rgba(255,255,255,1)");
        whiteGradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = whiteGradient;
        ctx.fillRect(0, 0, width, width);

        const blackGradient = ctx.createLinearGradient(0, 0, 0, width);
        blackGradient.addColorStop(0, "rgba(0,0,0,0)");
        blackGradient.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = blackGradient;
        ctx.fillRect(0, 0, width, width);

        // draw a faint border around the sketch picker
        ctx.beginPath();
        ctx.strokeStyle = "hsla(0, 0%, 90%, 1)";
        ctx.strokeRect(0, 0, width, width);
      }
    }
  }, [sketchColor, width]);

  const drawColorPicker = useCallback(() => {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        if (mouse.x < width && mouse.y < width) {
          ctx.clearRect(0, 0, width, width);
          ctx.beginPath();

          ctx.lineWidth = 2;
          ctx.arc(mouse.x, mouse.y, pickerRadius * 2, 0, 2 * Math.PI);
          ctx.strokeStyle = "white";
          ctx.stroke();
        }
      }
    }
  }, [mouse, pickerRadius, width]);

  useEffect(() => {
    drawColorSketch();
  }, [drawColorSketch]);

  useEffect(() => {
    drawColorPicker();
  }, [drawColorPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (colorSketch.current && canDrag.current) {
      const ctx = colorSketch.current.getContext("2d");
      if (ctx) {
        const { left, top } = colorSketch.current.getBoundingClientRect();
        const [x, y] = [e.clientX - left, e.clientY - top];
        const data = ctx.getImageData(x, y, 1, 1).data.slice(0, -1);
        setColor(
          CM(`rgb(${data.join(", ")})`)
            .hueTo(sketchColor.hue)
            .alphaTo(color.alpha)
        ); // maintain hue of the sketch
        setMouse({ x, y });
      }
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  return (
    <>
      <CanvasContainer width={width} height={width}>
        <canvas width={width} height={width} ref={colorSketch}></canvas>
        <canvas
          width={width}
          height={width}
          ref={colorPicker}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        ></canvas>
      </CanvasContainer>

      <Divider hidden></Divider>

      <HuePicker width={width} height={15} color={color} setColor={setColor} setSketchColor={setSketchColor} />

      <AlphaPicker width={width} height={15} color={color} setColor={setColor} />
    </>
  );
}
