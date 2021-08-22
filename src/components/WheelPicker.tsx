import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer, Swatch } from "../styles/Wheel";
import RangeSlider from "./RangeSlider";

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

  const [mouse, setMouse] = useState({ x: radius, y: 50 });
  const [slider, setSlider] = useState(0);

  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(75);
  const [lightness, setLightness] = useState(50);

  useEffect(() => {
    drawColorWheel();
  }, []);

  useEffect(() => {
    drawColorWheel(lightness);
  }, [lightness]);

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

  function drawColorPicker({ slider }: { slider: boolean }) {
    if (colorPicker.current) {
      const ctx = colorPicker.current.getContext("2d");

      if (ctx) {
        if (Math.pow(mouse.x - radius, 2) + Math.pow(mouse.y - radius, 2) <= Math.pow(radius, 2)) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();

          if (slider) {
            const cos0 = Math.cos(((hue - rotate) * Math.PI) / 180);
            const hyp = (saturation * radius) / 100;
            const x = radius + hyp * cos0;
            const y = radius - (rotate < hue && hue < rotate + 180 ? -1 : 1) * hyp * Math.sqrt(1 - Math.pow(cos0, 2));

            ctx.moveTo(x, y);
            ctx.arc(x, y, pickerRadius, 0, 2 * Math.PI);
          } else {
            ctx.moveTo(mouse.x, mouse.y);
            ctx.arc(mouse.x, mouse.y, pickerRadius, 0, 2 * Math.PI);

            setHue((360 + rotate - (Math.atan2(radius - mouse.y, mouse.x - radius) * 180) / Math.PI) % 360);
            setSaturation((Math.sqrt(Math.pow(mouse.y - radius, 2) + Math.pow(mouse.x - radius, 2)) * 100) / radius);
          }

          ctx.fillStyle = "#00000088";
          ctx.strokeStyle = "transparent";
          ctx.fill();
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

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const val = e.target.valueAsNumber;
    setState(val);
    setSlider(val);
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
          onMouseLeave={handleMouseUp}
        ></canvas>
      </CanvasContainer>

      <div>
        X: {mouse.x - radius}, Y: {radius - mouse.y}
      </div>
      <Swatch width={swatchWidth} height={swatchWidth} fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}>
        <circle cx={swatchWidth / 2} cy={swatchWidth / 2} r={swatchWidth / 4} />
      </Swatch>

      <RangeSlider
        value={hue}
        color={`hsla(${hue}, 100%, 50%, 1)`}
        title="Hue"
        max="359.99"
        postfix="&deg;"
        onChange={(e) => handleSliderChange(e, setHue)}
      />

      <RangeSlider
        value={saturation}
        color={`hsla(${hue}, ${saturation}%, 50%, 1)`}
        title="Saturation"
        max="100"
        postfix="%"
        onChange={(e) => handleSliderChange(e, setSaturation)}
      />

      <RangeSlider
        value={lightness}
        color={`hsla(0, 0%, ${lightness}%, 1)`}
        title="Lightness"
        max="100"
        postfix="%"
        onChange={(e) => handleSliderChange(e, setLightness)}
      />
    </>
  );
}
