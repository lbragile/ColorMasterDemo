import React, { useCallback, useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import { Divider } from "semantic-ui-react";
import { Ihsla } from "colormaster/types";
import CM, { ColorMaster } from "colormaster";

interface IWheelPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  radius?: number;
  pickerRadius?: number;
  rotate?: number;
}

export default function WheelPicker({
  color,
  setColor,
  radius = 200,
  pickerRadius = 5,
  rotate = 90
}: IWheelPicker): JSX.Element {
  const [mouse, setMouse] = useState({ x: radius, y: 50 });

  const colorWheel = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);
  const prevColor = useRef(CM("rgba(0, 0, 0, 0)"));

  const drawColorWheel = useCallback(() => {
    if (colorWheel.current) {
      const ctx = colorWheel.current.getContext("2d");
      const radScale = Math.PI / 180;

      if (ctx) {
        ctx.clearRect(0, 0, radius * 2, radius * 2);
        const [x, y] = [radius, radius];
        const { l, a } = color.hsla();

        for (let hue = 0; hue < 360; hue++) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, `hsla(${hue + rotate}, 0%, ${l}%, ${a})`);
          gradient.addColorStop(1, `hsla(${hue + rotate}, 100%, ${l}%, ${a})`);

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, radius, radScale * (hue - 1), radScale * (hue + 1));
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // draw a faint border around the color wheel so that it is "visible" at all times
        ctx.beginPath();
        ctx.strokeStyle = "hsla(0, 0%, 95%, 1)";
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, [radius, rotate, color]);

  const drawColorPicker = useCallback(
    ({ slider, hsla, mousePos }: { slider: boolean; hsla: Ihsla; mousePos: { x: number; y: number } }) => {
      if (colorPicker.current) {
        const ctx = colorPicker.current.getContext("2d");

        let { x, y } = mousePos;

        if (ctx && Math.pow(x - radius, 2) + Math.pow(y - radius, 2) <= Math.pow(radius, 2)) {
          const { h, s, l, a } = hsla;

          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();

          if (slider) {
            const cos0 = Math.cos(((h - rotate) * Math.PI) / 180);
            const hyp = (s * radius) / 100;
            x = radius + hyp * cos0;
            y = radius - (rotate < h && h < rotate + 180 ? -1 : 1) * hyp * Math.sqrt(1 - Math.pow(cos0, 2));

            ctx.arc(x, y, pickerRadius, 0, 2 * Math.PI);
          } else {
            ctx.arc(x, y, pickerRadius, 0, 2 * Math.PI);
            setColor(
              CM({
                h: (360 + rotate - (Math.atan2(radius - y, x - radius) * 180) / Math.PI) % 360,
                s: (Math.sqrt(Math.pow(y - radius, 2) + Math.pow(x - radius, 2)) * 100) / radius,
                l,
                a
              })
            );
          }

          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fill();
        }
      }
    },
    [pickerRadius, radius, rotate, setColor]
  );

  useEffect(() => {
    if (color.lightness !== prevColor.current.lightness || color.alpha !== prevColor.current.alpha) {
      drawColorWheel();
    }

    return () => {
      prevColor.current = color;
    };
  }, [color, drawColorWheel]);

  useEffect(() => {
    drawColorPicker({ slider: prevColor.current !== color, hsla: color.hsla(), mousePos: mouse });

    return () => {
      prevColor.current = color;
    };
  }, [color, mouse, drawColorPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (colorWheel.current && canDrag.current) {
      const { left, top } = colorWheel.current.getBoundingClientRect();
      setMouse({ x: e.clientX - left, y: e.clientY - top });
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  return (
    <>
      <CanvasContainer width={2 * radius} height={2 * radius}>
        <canvas width={2 * radius} height={2 * radius} ref={colorWheel}></canvas>
        <canvas
          width={2 * radius}
          height={2 * radius}
          ref={colorPicker}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        ></canvas>
      </CanvasContainer>

      <Divider hidden></Divider>

      <HuePicker width={radius * 2} height={15} color={color} setColor={setColor} />

      <AlphaPicker width={radius * 2} height={15} color={color} setColor={setColor} />
    </>
  );
}
