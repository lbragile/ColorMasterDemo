import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./HSLSliderGroup";
import CM from "colormaster";
import { TChannelHSL } from "colormaster/types";

interface IWheelPicker {
  radius?: number;
  pickerRadius?: number;
  swatchWidth?: number;
  rotate?: number;
  initHSL?: [number, number, number];
}

export default function WheelPicker({
  radius = 200,
  pickerRadius = 5,
  swatchWidth = 100,
  rotate = 90,
  initHSL = [0, 75, 50]
}: IWheelPicker): JSX.Element {
  const colorWheel = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [mouse, setMouse] = useState({ x: radius, y: 50 });
  const [slider, setSlider] = useState(0);

  const [color, setColor] = useState(CM(`hsla(${initHSL[0]}, ${initHSL[1]}%, ${initHSL[2]}%, 1)`));

  useEffect(() => {
    drawColorWheel();
  }, []);

  useEffect(() => {
    drawColorWheel(color.lightness);
  }, [color.lightness]);

  useEffect(() => {
    drawColorPicker({ slider: true });
  }, [slider]);

  useEffect(() => {
    drawColorPicker({ slider: false });
  }, [mouse]);

  function drawColorWheel(light = 50) {
    if (colorWheel.current) {
      const ctx = colorWheel.current.getContext("2d");

      if (ctx) {
        for (let sat = 100; sat > 0; sat -= 2) {
          for (let hue = 0; hue < 360; hue++) {
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, (sat * radius) / 100, (Math.PI / 180) * hue, (Math.PI / 180) * (hue + 1));
            ctx.fillStyle = `hsl(${hue + rotate}, ${sat}%, ${light}%)`;
            ctx.fill();
          }
        }
      }
    }
  }

  function drawColorPicker({ slider }: { slider: boolean }) {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        if (Math.pow(mouse.x - radius, 2) + Math.pow(mouse.y - radius, 2) <= Math.pow(radius, 2)) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();

          const { h, s, l, a } = color.hsla();

          if (slider) {
            const cos0 = Math.cos(((h - rotate) * Math.PI) / 180);
            const hyp = (s * radius) / 100;
            const x = radius + hyp * cos0;
            const y = radius - (rotate < h && h < rotate + 180 ? -1 : 1) * hyp * Math.sqrt(1 - Math.pow(cos0, 2));

            ctx.arc(x, y, pickerRadius, 0, 2 * Math.PI);
          } else {
            ctx.arc(mouse.x, mouse.y, pickerRadius, 0, 2 * Math.PI);

            setColor(
              CM({
                h: (360 + rotate - (Math.atan2(radius - mouse.y, mouse.x - radius) * 180) / Math.PI) % 360,
                s: (Math.sqrt(Math.pow(mouse.y - radius, 2) + Math.pow(mouse.x - radius, 2)) * 100) / radius,
                l,
                a
              })
            );
          }

          ctx.lineWidth = 2;
          ctx.strokeStyle = "black";
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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: TChannelHSL) => {
    const val = e.target.valueAsNumber;
    setSlider(val);

    const { h, s, l, a } = color.hsla();

    switch (type) {
      case "hue":
        setColor(CM({ h: val, s, l, a }));
        break;

      case "saturation":
        setColor(CM({ h, s: val, l, a }));
        break;

      case "lightness":
        setColor(CM({ h, s, l: val, a }));
        break;

      default:
        setColor(CM({ h, s, l, a: val / 100 }));
        break;
    }
  };

  return (
    <>
      <CanvasContainer height={radius * 2}>
        <canvas width={2 * radius} height={2 * radius} ref={colorWheel}></canvas>
        <canvas
          width={2 * radius}
          height={2 * radius}
          ref={colorPicker}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </CanvasContainer>

      <div>
        X: {mouse.x - radius}, Y: {radius - mouse.y}
      </div>

      <Swatch radius={swatchWidth / 2} background={color.stringHSL()} />

      <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
    </>
  );
}
