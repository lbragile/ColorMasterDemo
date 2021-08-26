import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import CM from "colormaster";
import SliderGroupSelector from "./SliderGroupSelector";

interface IWheel {
  swatchColor: string;
  setSwatchColor: (arg: string) => void;
  sketchColor: string;
  setSketchColor: (arg: string) => void;
  width?: number;
  height?: number;
  stats?: boolean;
}

export default function HuePicker({
  swatchColor,
  setSwatchColor,
  sketchColor,
  setSketchColor,
  width = 400,
  height = 25,
  stats = false
}: IWheel): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: (CM(sketchColor).hue / 360) * (width - 1), y: height / 2 });
  const [color, setColor] = useState(CM(sketchColor));

  useEffect(() => {
    drawColorHue();
  }, []);

  useEffect(() => {
    drawColorPicker(mouse.x);
  }, [mouse]);

  function drawColorHue() {
    if (colorHue.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        ctx.rect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
        gradient.addColorStop(0.17, "rgba(255, 255, 0, 1)");
        gradient.addColorStop(0.34, "rgba(0, 255, 0, 1)");
        gradient.addColorStop(0.51, "rgba(0, 255, 255, 1)");
        gradient.addColorStop(0.68, "rgba(0, 0, 255, 1)");
        gradient.addColorStop(0.85, "rgba(255, 0, 255, 1)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }

  function drawColorPicker(x: number) {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();

        ctx.arc(x, height / 2, height / 2, 0, 2 * Math.PI);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (colorHue.current && canDrag.current) {
      const ctx = colorHue.current.getContext("2d");

      if (ctx) {
        const { left, top } = colorHue.current.getBoundingClientRect();
        const [x, y] = [e.clientX - Math.floor(left), e.clientY - Math.floor(top)];

        const data = ctx.getImageData(x === width ? x - 1 : x, y === height ? y - 1 : y, 1, 1).data.slice(0, -1);
        const newColor = CM(`rgba(${data.join(", ")}, 1)`);
        setMouse({ x, y });
        setColor(newColor);
        setSketchColor(newColor.stringRGB());
        setSwatchColor(CM(swatchColor).hueTo(newColor.hue).stringRGB());
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  return (
    <>
      <CanvasContainer height={height}>
        <canvas width={width} height={height} ref={colorHue}></canvas>
        <canvas
          width={width}
          height={height}
          ref={colorPicker}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </CanvasContainer>

      <SliderGroupSelector color={color} setColor={setColor} drawHuePicker={drawColorPicker} stats={stats} />
    </>
  );
}
