import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer, Swatch } from "../styles/Wheel";
import RangeSlider from "./RangeSlider";
import CM from "colormaster";

interface IWheel {
  initColor: string;
  swatchColor: string;
  setSwatchColor: (arg: string) => void;
  setSketchColor: (arg: string) => void;
  width?: number;
  height?: number;
}

export default function HuePicker({
  initColor,
  swatchColor,
  setSwatchColor,
  setSketchColor,
  width = 400,
  height = 25
}: IWheel): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: (CM(initColor).hue / 360) * width, y: height / 2 });
  const [rgb, setRgb] = useState(CM(initColor));

  useEffect(() => {
    drawColorHue();
  }, []);

  useEffect(() => {
    drawColorPicker(mouse.x, mouse.y);
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

  function drawColorPicker(x: number, y: number) {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        if (x <= width && y <= height) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();

          ctx.arc(x, height / 2, height / 2, 0, 2 * Math.PI);

          // cross-hair
          ctx.moveTo(x - height / 2, height / 2);
          ctx.lineTo(x + height / 2, height / 2);
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);

          ctx.strokeStyle = "#fff";
          ctx.fillStyle = "hsla(0, 0%, 50%, 0.3)";
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
        }
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
        const [x, y] = [e.clientX - left, e.clientY - top];

        const data = ctx.getImageData(x, y, 1, 1).data.slice(0, -1);
        const color = CM(`rgba(${data.join(", ")}, 1)`);

        setMouse({ x, y });
        setRgb(color);
        setSketchColor(color.stringRGB());
        setSwatchColor(CM(swatchColor).hueTo(color.hue).stringRGB());
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.valueAsNumber;
    const color = CM(`hsla(${val}, 100%, 50%, 1)`);
    drawColorPicker((val * width) / 360, height / 2);
    setRgb(color);
    setSketchColor(color.stringRGB());
    setSwatchColor(CM(swatchColor).hueTo(color.hue).stringRGB());
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

      <div>
        X: {mouse.x - width}, Y: {width - mouse.y}
      </div>

      <Swatch width={200} height={200} fill={swatchColor}>
        <circle cx={200 / 2} cy={200 / 2} r={200 / 4} />
      </Swatch>

      <RangeSlider
        value={rgb.hue}
        color={rgb.stringRGB()}
        title="H"
        max="359.99"
        postfix="&deg;"
        onChange={handleSliderChange}
      />
    </>
  );
}
