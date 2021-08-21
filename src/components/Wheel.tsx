import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const CanvasContainer = styled.div.attrs((props: { radius: number }) => props)`
  position: relative;
  height: ${(props) => (props.radius * 2 ?? 400) + "px"};

  & canvas {
    position: absolute;
    top: 0;
    left: 0;

    &:first-child {
      z-index: 0;
    }

    &:last-child {
      cursor: crosshair;
      z-index: 1;
    }
  }
`;

const Swatch = styled.svg.attrs((props: { width: number; height: number; fill: string }) => ({
  style: { fill: props.fill } // this changes a lot
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

interface IWheel {
  radius?: number;
  pickerRadius?: number;
  swatchWidth?: number;
  rotate?: number;
}

export default function Wheel({ radius = 200, pickerRadius = 5, swatchWidth = 200, rotate = 90 }: IWheel): JSX.Element {
  const colorWheel = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: 200, y: 200 });
  const [hueAngle, setHueAngle] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(50);

  useEffect(() => {
    drawColorWheel();
  }, []);

  useEffect(() => {
    drawColorWheel(lightness);
  }, [lightness]);

  useEffect(() => {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        if (Math.pow(mouse.x - radius, 2) + Math.pow(mouse.y - radius, 2) <= Math.pow(radius, 2)) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.arc(mouse.x, mouse.y, pickerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "#00000088";
          ctx.strokeStyle = "transparent";
          ctx.fill();
          ctx.stroke();
        }

        const hue = (Math.atan2(radius - mouse.y, mouse.x - radius) * 180) / Math.PI;
        setHueAngle(rotate - (hue < 0 ? hue + 360 : hue));

        setSaturation((Math.sqrt(Math.pow(mouse.y - radius, 2) + Math.pow(mouse.x - radius, 2)) * 100) / radius);
      }
    }
  }, [mouse]);

  function drawColorWheel(light = 50) {
    if (colorWheel.current) {
      const ctx = colorWheel.current.getContext("2d");

      if (ctx) {
        for (let sat = 100; sat >= 0; sat--) {
          for (let i = 0; i <= 360; i++) {
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, (sat * radius) / 100, (Math.PI / 180) * Math.max(0, i - 2), (Math.PI / 180) * i);
            ctx.fillStyle = `hsl(${i + rotate}, ${sat}%, ${light}%)`;
            ctx.fill();
            ctx.strokeStyle = "transparent";
            ctx.stroke();
            ctx.closePath();
          }
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
    if (colorWheel.current && canDrag.current) {
      const { left, top } = colorWheel.current.getBoundingClientRect();
      setMouse({ x: e.clientX - left, y: e.clientY - top });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseMove(e);
    canDrag.current = false;
  };

  return (
    <>
      <CanvasContainer radius={radius}>
        <canvas width={2 * radius} height={2 * radius} ref={colorWheel}></canvas>
        <canvas
          width={2 * radius}
          height={2 * radius}
          ref={colorPicker}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        ></canvas>
      </CanvasContainer>

      <div>
        X: {mouse.x - radius}, Y: {radius - mouse.y}
      </div>
      <Swatch width={swatchWidth} height={swatchWidth} fill={`hsl(${hueAngle}, ${saturation}%, ${lightness}%)`}>
        <rect x="0" y="0" width={swatchWidth - 50 + ""} height={swatchWidth - 50 + ""} />
      </Swatch>
      <input
        type="range"
        id="lightness"
        name="lightness"
        min="0"
        max="100"
        value={lightness.toString()}
        step="0.01"
        onChange={(e) => setLightness(+e.target.value)}
        draggable={false}
      />
      <label htmlFor="lightness">{lightness}% Lightness</label>
    </>
  );
}
