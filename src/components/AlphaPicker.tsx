import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer, Swatch } from "../styles/Wheel";
import RangeSlider from "./RangeSlider";

interface IWheel {
  width?: number;
  height?: number;
  rgb?: [number, number, number];
}

export default function AlphaPicker({ width = 400, height = 25, rgb = [0, 255, 255] }: IWheel): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: width / 2, y: height / 2 });
  const [alpha, setAlpha] = useState(mouse.x / width);

  useEffect(() => {
    drawColorAlpha();
  }, []);

  useEffect(() => {
    drawColorPicker(mouse.x, mouse.y);
  }, [mouse]);

  // https://stackoverflow.com/a/27667424/4298115
  function drawCheckeredBackground(ctx: CanvasRenderingContext2D) {
    let { width: w, height: h } = ctx.canvas;

    const cols = 50;

    w /= cols; // width of a block
    h /= 2; // height of a block

    // first row
    for (let j = 0; j < cols; j++) {
      ctx.rect(2 * j * w, 0, w, h);
    }

    // second row
    for (let j = 0; j < cols; j++) {
      ctx.rect((2 * j + 1) * w, h, w, h);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();
  }

  function drawColorAlpha() {
    if (colorHue.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        drawCheckeredBackground(ctx);

        ctx.rect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${rgb.join(", ")}, 0)`);
        gradient.addColorStop(1, `rgba(${rgb.join(", ")}, 1)`);
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

          ctx.lineWidth = 2;
          ctx.moveTo(x, height - 6);
          ctx.lineTo(x + 5, height - 1);
          ctx.lineTo(x - 5, height - 1);
          ctx.lineTo(x, height - 6);
          ctx.lineTo(x, 5);
          ctx.lineTo(x + 5, 0);
          ctx.lineTo(x - 5, 0);
          ctx.lineTo(x, 5);

          ctx.strokeStyle = "#0005";
          ctx.fillStyle = "#0005";
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

        const newAlpha = x / width;
        setMouse({ x, y });
        setAlpha(newAlpha);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.valueAsNumber / 100;
    drawColorPicker(val * width, height / 2);
    setAlpha(val);
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

      <Swatch width={200} height={200} fill={`rgba(${rgb.join(", ")}, ${alpha})`}>
        <circle cx={200 / 2} cy={200 / 2} r={200 / 4} />
      </Swatch>

      <RangeSlider
        value={alpha * 100}
        color="black"
        title="Alpha"
        max="100"
        postfix="%"
        onChange={handleSliderChange}
      />
    </>
  );
}
