import React, { useCallback, useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import CM, { ColorMaster } from "colormaster";

interface IAlphaPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  width?: number;
  height?: number;
  initRGB?: [number, number, number, number?];
}

export default function AlphaPicker({ color, setColor, width = 400, height = 25 }: IAlphaPicker): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: width / 2, y: height / 2 });

  // https://stackoverflow.com/a/27667424/4298115
  function drawCheckeredBackground(ctx: CanvasRenderingContext2D) {
    let { width: w, height: h } = ctx.canvas;

    const cols = 50;

    w /= cols; // width of a block
    h /= 2; // height of a block

    for (let j = 0; j < cols; j++) {
      ctx.rect(2 * j * w, 0, w, h); // first row
      ctx.rect((2 * j + 1) * w, h, w, h); // second row
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();
  }

  const drawColorAlpha = useCallback(() => {
    if (colorHue.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        drawCheckeredBackground(ctx);

        ctx.rect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const { r, g, b } = color.rgba();
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }, [color, height, width]);

  const drawColorPicker = useCallback(() => {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();

        ctx.arc(color.alpha * width, height / 2, height / 2, 0, 2 * Math.PI);

        ctx.lineWidth = 2;
        ctx.fillStyle = "hsla(0, 0%, 50%, 0.6)";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        ctx.closePath();
      }
    }
  }, [width, height, color]);

  useEffect(() => {
    drawColorAlpha();
  }, [drawColorAlpha]);

  useEffect(() => {
    drawColorPicker();
  }, [mouse, drawColorPicker]);

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
        setMouse({ x, y });
        setColor(CM(`rgba(${color.red}, ${color.green}, ${color.blue}, ${x / (width - 1)})`));
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
    </>
  );
}
