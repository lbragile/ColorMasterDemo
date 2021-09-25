import React, { useEffect, useRef } from "react";
import AlphaPicker from "./AlphaPicker";
import HuePicker from "./HuePicker";
import CM, { ColorMaster } from "colormaster";
import useCanvasContext from "../../hooks/useCanvasContext";
import CanvasGroup from "../CanvasGroup";
import { FlexRow } from "../../styles/Flex";

interface IWheelPicker {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  pickerRadius?: number;
  rotate?: number;
  harmony?: ColorMaster[];
  verticalPickers?: boolean;
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
export default function WheelPicker({
  color,
  setColor,
  pickerRadius = 5,
  rotate = 90,
  harmony = undefined,
  verticalPickers = true
}: IWheelPicker): JSX.Element {
  const colorWheel = useRef<HTMLCanvasElement>(null);
  const colorPicker = useRef<HTMLCanvasElement>(null);
  const canDrag = useRef(false);

  const [ctxWheel, ctxPicker] = useCanvasContext(colorWheel, colorPicker);

  useEffect(() => {
    const radScale = Math.PI / 180;

    if (ctxWheel) {
      const radius = ctxWheel.canvas.width / 2 - 5;

      ctxWheel.clearRect(0, 0, radius * 2 + 10, radius * 2 + 10);
      const [x, y] = [radius + 5, radius + 5];
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
    }
  }, [rotate, color, ctxWheel]);

  useEffect(() => {
    if (ctxPicker) {
      const radius = ctxPicker.canvas.width / 2 - 5;
      ctxPicker.clearRect(0, 0, radius * 2 + 10, radius * 2 + 10);

      const colorArr = harmony ?? [color];
      colorArr.forEach((c, i) => {
        const { h, s } = c.hsla();
        ctxPicker.beginPath();

        const cos0 = Math.cos(((h - rotate) * Math.PI) / 180);
        const hyp = (s * radius) / 100;
        const x = radius + hyp * cos0;
        const y = radius - (rotate < h && h < rotate + 180 ? -1 : 1) * hyp * Math.sqrt(1 - Math.pow(cos0, 2));

        ctxPicker.arc(x + 5, y + 5, pickerRadius, 0, 2 * Math.PI);

        const pickerColor = "rgba(0,0,0,0.6)";
        ctxPicker.fillStyle = pickerColor;
        ctxPicker.strokeStyle = pickerColor;
        ctxPicker.lineWidth = 1;
        ctxPicker.fill();
        ctxPicker.stroke();

        if (colorArr.length > 1) {
          ctxPicker.fillStyle = "white";
          ctxPicker.font = "bold 10px Arial";
          ctxPicker.textAlign = "center";
          ctxPicker.textBaseline = "middle";
          ctxPicker.fillText((i + 1).toString(), x + 5, y + 5);
        }
      });
    }
  }, [pickerRadius, rotate, color, harmony, ctxPicker]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();
    canDrag.current = true;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDrag.current && ctxWheel) {
      const { left, top } = ctxWheel.canvas.getBoundingClientRect();
      const [x, y] = [e.clientX - left, e.clientY - top];
      const r = ctxWheel.canvas.width / 2;

      // only update the color if the click occurred within the circle
      const pos = { x: x - r, y: r - y };
      if (Math.pow(pos.x, 2) + Math.pow(pos.y, 2) <= Math.pow(r, 2)) {
        const hue = (Math.atan2(pos.x, pos.y) * 180) / Math.PI;
        const sat = (Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2)) * 100) / r;
        const currentColor = CM(color.rgba()); // deep clone the `color` state variable
        setColor(currentColor.hueTo(hue).saturationTo(sat));
      }
    }
  };

  const handlePointerUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerMove(e);
    canDrag.current = false;
  };

  const CommonProps = { thickness: 15, vertical: verticalPickers, color, setColor };

  return (
    <FlexRow $gap="4px">
      <CanvasGroup
        className="wheel"
        mainRef={colorWheel}
        picker={{
          ref: colorPicker,
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp
        }}
      />

      <HuePicker {...CommonProps} />
      <AlphaPicker {...CommonProps} />
    </FlexRow>
  );
}
