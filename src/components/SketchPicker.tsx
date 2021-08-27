import React, { useCallback, useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import SliderGroupSelector from "./SliderGroupSelector";
import { Grid } from "semantic-ui-react";
import CM from "colormaster";

interface ISketchPicker {
  width?: number;
  pickerRadius?: number;
}

export default function SketchPicker({ width = 400, pickerRadius = 5 }: ISketchPicker): JSX.Element {
  const colorSketch = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [sketchColor, setSketchColor] = useState(CM("rgba(200, 125, 50, 1)"));
  const [swatchColor, setSwatchColor] = useState(sketchColor);
  const [mouse, setMouse] = useState({ x: sketchColor.alpha * (width - 1), y: 0 });

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
      }
    }
  }, [sketchColor, width]);

  const drawColorPicker = useCallback(() => {
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
  }, [mouse, pickerRadius, width]);

  useEffect(() => {
    drawColorSketch();
  }, [drawColorSketch]);

  useEffect(() => {
    drawColorPicker();
    if (colorSketch.current) {
      const ctx = colorSketch.current.getContext("2d");
      if (ctx) {
        const data = ctx.getImageData(mouse.x, mouse.y, 1, 1).data.slice(0, -1);
        setSwatchColor(CM(`rgba(${data.join(", ")}, 1)`));
      }
    }
  }, [mouse, drawColorPicker]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (colorSketch.current && canDrag.current) {
      const ctx = colorSketch.current.getContext("2d");
      if (ctx) {
        const { left, top } = colorSketch.current.getBoundingClientRect();
        const [x, y] = [e.clientX - left, e.clientY - top];
        const data = ctx.getImageData(x, y, 1, 1).data.slice(0, -1);

        const newColor = CM(`rgba(${data.join(", ")}, ${sketchColor.alpha})`);
        setSwatchColor(newColor);
        setMouse({ x, y });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  return (
    <Grid columns={2} verticalAlign="middle">
      <Grid.Column>
        <SliderGroupSelector color={sketchColor} setColor={setSketchColor} />
      </Grid.Column>

      <Grid.Column>
        <CanvasContainer height={width}>
          <canvas width={width} height={width} ref={colorSketch}></canvas>
          <canvas
            width={width}
            height={width}
            ref={colorPicker}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </CanvasContainer>

        <HuePicker
          width={width}
          height={25}
          color={sketchColor}
          setColor={setSketchColor}
          swatchColor={swatchColor}
          setSwatchColor={setSwatchColor}
        />

        <AlphaPicker width={width} height={25} color={sketchColor} setColor={setSketchColor} />
      </Grid.Column>
    </Grid>
  );
}
