import React, { useEffect, useRef } from "react";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import { Divider } from "semantic-ui-react";
import CM, { ColorMaster } from "colormaster";
import useCanvasContext from "../../hooks/useCanvasContext";
import CanvasGroup from "../CanvasGroup";

interface IWheelPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  pickerRadius?: number;
  rotate?: number;
}

/**
 * To draw the color wheel:
 * - Assign each degree it's corresponding hue, such that red is at the 0/360 degree position.
 * - For each degree, get a radial-gradient by varying the saturation from 0%-100%.
 * - Adjust lightness and alpha values as needed.
 *
 * @note To avoid visible gaps between the drawn segments (due to pixel resolution), interlace the segments → current segment is drawn in range [hue-1, hue+1]
 * @note `radial-gradient` is used to be independent of quadrant. Using linear-gradient will have incorrect direction in some quadrants.
 */
export default function WheelPicker({ color, setColor, pickerRadius = 5, rotate = 90 }: IWheelPicker): JSX.Element {
  const colorWheel = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [ctxWheel, ctxPicker] = useCanvasContext(colorWheel, colorPicker);

  useEffect(() => {
    const radScale = Math.PI / 180;

    if (ctxWheel) {
      const radius = ctxWheel.canvas.width / 2;

      ctxWheel.clearRect(0, 0, radius * 2, radius * 2);
      const [x, y] = [radius, radius];
      const { l, a } = color.hsla();

      for (let hue = 0; hue < 360; hue++) {
        const gradient = ctxWheel.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `hsla(${hue + rotate}, 0%, ${l}%, ${a})`);
        gradient.addColorStop(1, `hsla(${hue + rotate}, 100%, ${l}%, ${a})`);

        ctxWheel.beginPath();
        ctxWheel.moveTo(x, y);
        ctxWheel.arc(x, y, radius, radScale * (hue - 1), radScale * (hue + 1));
        ctxWheel.fillStyle = gradient;
        ctxWheel.fill();
      }

      // draw a faint border around the color wheel so that it is "visible" at all times
      ctxWheel.beginPath();
      ctxWheel.strokeStyle = "hsla(0, 0%, 95%, 1)";
      ctxWheel.arc(x, y, radius, 0, 2 * Math.PI);
      ctxWheel.stroke();
    }
  }, [rotate, color, ctxWheel]);

  useEffect(() => {
    if (ctxPicker) {
      const radius = ctxPicker.canvas.width / 2;

      const { h, s } = color.hsla();
      ctxPicker.clearRect(0, 0, radius * 2, radius * 2);
      ctxPicker.beginPath();

      const cos0 = Math.cos(((h - rotate) * Math.PI) / 180);
      const hyp = (s * radius) / 100;
      const x = radius + hyp * cos0;
      const y = radius - (rotate < h && h < rotate + 180 ? -1 : 1) * hyp * Math.sqrt(1 - Math.pow(cos0, 2));

      ctxPicker.arc(x, y, pickerRadius, 0, 2 * Math.PI);

      ctxPicker.fillStyle = "rgba(0,0,0,0.6)";
      ctxPicker.fill();
    }
  }, [pickerRadius, rotate, color, ctxPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDrag.current && ctxWheel) {
      const { left, top } = ctxWheel.canvas.getBoundingClientRect();
      const [x, y] = [e.clientX - Math.floor(left), e.clientY - Math.floor(top)];
      const radius = ctxWheel.canvas.width / 2;

      // only update the color if the click occurred within the circle
      const pos = { x: x - radius, y: radius - y };
      if (Math.pow(pos.x, 2) + Math.pow(pos.y, 2) <= Math.pow(radius, 2)) {
        const hue = (Math.atan2(pos.x, pos.y) * 180) / Math.PI;
        const sat = (Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2)) * 100) / radius;
        setColor(CM(`hsla(${hue}, ${sat}%, ${color.lightness}%, ${color.alpha})`));
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
      <CanvasGroup
        mainRef={colorWheel}
        picker={{
          ref: colorPicker,
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp
        }}
      />

      <Divider hidden></Divider>

      <HuePicker height={15} color={color} setColor={setColor} />

      <AlphaPicker height={15} color={color} setColor={setColor} />
    </>
  );
}
