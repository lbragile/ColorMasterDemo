import React, { useCallback, useEffect, useRef, useState } from "react";
import { CanvasContainer } from "../styles/Canvas";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import SliderGroupSelector from "./SliderGroupSelector";
import { Divider, Grid } from "semantic-ui-react";
import { Ihsla } from "colormaster/types";
import CM from "colormaster";

interface IWheelPicker {
  radius?: number;
  pickerRadius?: number;
  rotate?: number;
  initRGB?: [number, number, number];
}

export default function WheelPicker({
  radius = 200,
  pickerRadius = 5,
  rotate = 90,
  initRGB = [200, 125, 50]
}: IWheelPicker): JSX.Element {
  const [mouse, setMouse] = useState({ x: radius, y: 50 });
  const [color, setColor] = useState(CM(`rgba(${initRGB[0]}, ${initRGB[1]}, ${initRGB[2]}, 1)`));

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
        for (let hue = 0; hue < 360; hue++) {
          const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
          gradient.addColorStop(0, `hsla(${hue + rotate}, 0%, ${color.lightness}%, ${color.alpha})`);
          gradient.addColorStop(1, `hsla(${hue + rotate}, 100%, ${color.lightness}%, ${color.alpha})`);

          ctx.beginPath();
          ctx.moveTo(radius, radius);
          ctx.arc(radius, radius, radius, radScale * (hue - 1), radScale * (hue + 1));
          ctx.fillStyle = gradient;
          ctx.fill();
        }
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
    [pickerRadius, radius, rotate]
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
    <Grid columns={2} verticalAlign="middle">
      <Grid.Column>
        <SliderGroupSelector color={color} setColor={setColor} initPicker={3} />
      </Grid.Column>

      <Grid.Column>
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

        <Divider hidden></Divider>

        <HuePicker width={radius * 2} height={25} color={color} setColor={setColor} />

        <Divider hidden></Divider>

        <AlphaPicker width={radius * 2} height={25} color={color} setColor={setColor} />
      </Grid.Column>
    </Grid>
  );
}
