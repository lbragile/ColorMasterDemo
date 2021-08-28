import React, { useCallback, useEffect, useRef } from "react";
import { CanvasContainer } from "../styles/Canvas";
import CM, { ColorMaster } from "colormaster";

interface IHuePicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  width?: number;
  height?: number;
  setSketchColor?: React.Dispatch<React.SetStateAction<ColorMaster>>;
}

export default function HuePicker({
  color,
  setColor,
  width = 400,
  height = 25,
  setSketchColor
}: IHuePicker): JSX.Element {
  const colorHue = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const drawColorPicker = useCallback(() => {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();

        ctx.arc((color.hue * width) / 360, height / 2, height / 2, 0, 2 * Math.PI);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }, [height, width, color]);

  const drawHuePicker = useCallback(() => {
    if (colorHue.current) {
      const ctx = colorHue.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.rect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const a = color.alpha;
        gradient.addColorStop(0, `rgba(255, 0, 0, ${a})`);
        gradient.addColorStop(0.17, `rgba(255, 255, 0, ${a})`);
        gradient.addColorStop(0.34, `rgba(0, 255, 0, ${a})`);
        gradient.addColorStop(0.51, `rgba(0, 255, 255, ${a})`);
        gradient.addColorStop(0.68, `rgba(0, 0, 255, ${a})`);
        gradient.addColorStop(0.85, `rgba(255, 0, 255, ${a})`);
        gradient.addColorStop(1, `rgba(255, 0, 0, ${a})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }, [height, width, color]);

  useEffect(() => {
    drawHuePicker();
  }, [drawHuePicker]);

  useEffect(() => {
    drawColorPicker();
  }, [drawColorPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (colorHue.current && canDrag.current) {
      const ctx = colorHue.current.getContext("2d");

      if (ctx) {
        const { left, top } = colorHue.current.getBoundingClientRect();
        const [x, y] = [e.clientX - Math.floor(left), e.clientY - Math.floor(top)];

        const data = ctx.getImageData(x === width ? x - 1 : x, y === height ? y - 1 : y, 1, 1).data.slice(0, -1);
        const newColor = CM(`rgba(${data.join(", ")}, ${color.alpha})`);
        setColor(CM({ ...color.hsla(), h: newColor.hue }));
        setSketchColor?.(CM(`hsla(${newColor.hue}, 100%, 50%, 1)`));
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
      <CanvasContainer height={height}>
        <canvas width={width} height={height} ref={colorHue}></canvas>
        <canvas
          width={width}
          height={height}
          ref={colorPicker}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        ></canvas>
      </CanvasContainer>
    </>
  );
}
