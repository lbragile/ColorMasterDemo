import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer, Swatch } from "../styles/Wheel";

interface IWheel {
  width?: number;
  pickerRadius?: number;
  swatchWidth?: number;
}

export default function Flat({ width = 400, pickerRadius = 5, swatchWidth = 200 }: IWheel): JSX.Element {
  const colorFlat = useRef<HTMLCanvasElement>(null);
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: width / 2, y: width / 2 });
  const [rgb, setRgb] = useState("rgba(255, 0, 0, 1)");

  useEffect(() => {
    drawColorFlat();
    drawColorHue();
  }, []);

  useEffect(() => {
    drawColorFlat();
  }, [rgb]);

  useEffect(() => {
    drawColorPicker();
  }, [mouse]);

  function drawColorFlat() {
    if (colorFlat.current) {
      const ctx = colorFlat.current.getContext("2d");

      if (ctx) {
        ctx.fillStyle = rgb;
        ctx.fillRect(0, 0, width, width);

        const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, "rgb(255,255,255,1)");
        whiteGradient.addColorStop(1, "rgb(255,255,255,0)");
        ctx.fillStyle = whiteGradient;
        ctx.fillRect(0, 0, width, width);

        const blackGradient = ctx.createLinearGradient(0, 0, 0, width);
        blackGradient.addColorStop(0, "rgb(0,0,0,0)");
        blackGradient.addColorStop(1, "rgb(0,0,0,1)");
        ctx.fillStyle = blackGradient;
        ctx.fillRect(0, 0, width, width);
      }
    }
  }

  function drawColorHue() {
    if (colorHue.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        ctx.rect(0, 0, width, 100);
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

  function drawColorPicker() {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        if (mouse.x <= width && mouse.y <= width) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();

          ctx.lineWidth = 2;
          ctx.arc(mouse.x, mouse.y, pickerRadius * 2, 0, 2 * Math.PI);
          ctx.strokeStyle = "white";
          ctx.stroke();
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
    if (colorFlat.current && canDrag.current) {
      const { left, top } = colorFlat.current.getBoundingClientRect();
      setMouse({ x: e.clientX - left, y: e.clientY - top });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  const recalculateRGB = (e: React.MouseEvent) => {
    if (colorHue.current && colorFlat.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        const { left, top } = colorFlat.current.getBoundingClientRect();
        const [x, y] = [e.clientX - left, e.clientY - top];
        const data = ctx.getImageData(x, y - width, 1, 1).data;
        setRgb(`rgba(${data.slice(0, -1).join(", ")}, 1)`);
      }
    }
  };

  return (
    <>
      <CanvasContainer radius={width / 2}>
        <canvas width={width} height={width} ref={colorFlat}></canvas>
        <canvas
          width={width}
          height={width}
          ref={colorPicker}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        ></canvas>
      </CanvasContainer>

      <canvas width={width} height={25} ref={colorHue} onClick={recalculateRGB}></canvas>

      <div>
        X: {mouse.x - width}, Y: {width - mouse.y}
      </div>
      <Swatch width={swatchWidth} height={swatchWidth} fill={rgb}>
        <circle cx={swatchWidth / 2} cy={swatchWidth / 2} r={swatchWidth / 4} />
      </Swatch>
    </>
  );
}
