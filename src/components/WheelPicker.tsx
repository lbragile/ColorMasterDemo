import React, { useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./HSLSliderGroup";

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

  const [hue, setHue] = useState(initHSL[0]);
  const [saturation, setSaturation] = useState(initHSL[1]);
  const [lightness, setLightness] = useState(initHSL[2]);

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

          if (slider) {
            const cos0 = Math.cos(((hue - rotate) * Math.PI) / 180);
            const hyp = (saturation * radius) / 100;
            const x = radius + hyp * cos0;
            const y = radius - (rotate < hue && hue < rotate + 180 ? -1 : 1) * hyp * Math.sqrt(1 - Math.pow(cos0, 2));

            ctx.arc(x, y, pickerRadius, 0, 2 * Math.PI);
          } else {
            ctx.arc(mouse.x, mouse.y, pickerRadius, 0, 2 * Math.PI);

            setHue((360 + rotate - (Math.atan2(radius - mouse.y, mouse.x - radius) * 180) / Math.PI) % 360);
            setSaturation((Math.sqrt(Math.pow(mouse.y - radius, 2) + Math.pow(mouse.x - radius, 2)) * 100) / radius);
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
        ></canvas>
      </CanvasContainer>

      <div>
        X: {mouse.x - radius}, Y: {radius - mouse.y}
      </div>

      <Swatch radius={swatchWidth / 2} background={`hsl(${hue}, ${saturation}%, ${lightness}%)`} />

      <HSLSliderGroup
        hue={hue}
        setHue={setHue}
        saturation={saturation}
        setSaturation={setSaturation}
        lightness={lightness}
        setLightness={setLightness}
        onChange={handleSliderChange}
      />
    </>
  );
}
