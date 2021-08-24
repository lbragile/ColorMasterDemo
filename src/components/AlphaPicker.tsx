import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import { Swatch } from "../styles/Swatch";
import RangeSlider from "./RangeSlider";
import RGBSliderGroup from "./RGBSliderGroup";

interface IWheel {
  width?: number;
  height?: number;
  initRGB?: [number, number, number];
}

export default function AlphaPicker({ width = 400, height = 25, initRGB = [0, 255, 255] }: IWheel): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: width / 2, y: height / 2 });
  const [alpha, setAlpha] = useState((mouse.x * 100) / width);
  const [red, setRed] = useState(initRGB[0]);
  const [green, setGreen] = useState(initRGB[1]);
  const [blue, setBlue] = useState(initRGB[2]);

  useEffect(() => {
    drawColorAlpha();
  }, [red, green, blue]);

  useEffect(() => {
    drawColorPicker(mouse.x);
  }, [mouse]);

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

  function drawColorAlpha() {
    if (colorHue.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        drawCheckeredBackground(ctx);

        ctx.rect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0)`);
        gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 1)`);
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
        ctx.fillStyle = "hsla(0, 0%, 50%, 0.6)";
        ctx.fill();
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
        const [x, y] = [e.clientX - left, e.clientY - top];

        setMouse({ x, y });
        setAlpha((x * 100) / (width - 1));
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>,
    isAlpha?: boolean
  ) => {
    const val = e.target.valueAsNumber;
    isAlpha && drawColorPicker((val / 100) * width);
    setState(val);
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
        X: {mouse.x}, Y: {height / 2}
      </div>

      <Swatch radius={50} background={`rgba(${red}, ${green}, ${blue}, ${alpha / 100})`} />

      <RangeSlider
        value={alpha}
        color="rgba(0,0,0,0.5)"
        title="A"
        max="100"
        postfix="%"
        onChange={(e) => handleSliderChange(e, setAlpha, true)}
      />

      <RGBSliderGroup
        red={red}
        setRed={setRed}
        green={green}
        setGreen={setGreen}
        blue={blue}
        setBlue={setBlue}
        onChange={handleSliderChange}
      />
    </>
  );
}
