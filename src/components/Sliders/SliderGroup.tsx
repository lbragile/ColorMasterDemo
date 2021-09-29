import React, { useCallback, useMemo } from "react";
import FullSlider from "./FullSlider";
import { FlexColumn } from "../../styles/Flex";
import CM, { ColorMaster } from "colormaster";
import { THexStr } from "colormaster/types";
import { TSetState } from "../../types/react";
import { TValidColorspace } from "../../types/colormaster";

interface ISliderGroup {
  colorArr: number[];
  setColor: TSetState<ColorMaster>;
  format: TValidColorspace;
  gap?: string;
}

export default function SliderGroup({ colorArr, setColor, format, gap = "" }: ISliderGroup): JSX.Element {
  const generateCMStr = useCallback(
    (arr: number[]): ColorMaster => {
      switch (format) {
        case "hex": {
          const formattedArr = arr.map(
            (val, i) => ("0" + Math.round(i === arr.length - 1 ? val * 255 : val).toString(16)).slice(-2) as THexStr
          );
          return CM({ r: formattedArr[0], g: formattedArr[1], b: formattedArr[2], a: formattedArr[3] });
        }

        case "hsl":
          return CM({ h: arr[0], s: arr[1], l: arr[2], a: arr[3] });

        default:
          return CM({ r: arr[0], g: arr[1], b: arr[2], a: arr[3] });
      }
    },
    [format]
  );

  const formattedProps = useMemo(() => {
    switch (format) {
      case "hex":
        return {
          color: ["red", "lime", "blue", "rgba(0,0,0,0.5)"],
          min: ["0", "0", "0", "0"],
          max: ["255", "255", "255", "255"],
          postfix: ["", "", "", "%"],
          title: "RGB"
        };

      case "hsl":
        return {
          color: [
            `hsla(${colorArr[0]}, 100%, 50%, 1)`,
            `hsla(${colorArr[0]}, ${colorArr[1]}%, 50%, 1)`,
            `hsla(0, 0%, ${colorArr[2] - 5}%, 1)`,
            "rgba(0,0,0,0.5)"
          ],
          min: ["0", "0", "0", "0"],
          max: ["359.99", "100", "100", "100"],
          postfix: ["°", "%", "%", "%"],
          title: format.toUpperCase()
        };

      default:
        // rgb
        return {
          color: ["red", "lime", "blue", "rgba(0,0,0,0.5)"],
          min: ["0", "0", "0", "0"],
          max: ["255", "255", "255", "100"],
          postfix: ["", "", "", "%"],
          title: format.toUpperCase()
        };
    }
  }, [format, colorArr]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, channel: number) => {
    const val = parseInt(e.target.value, format === "hex" ? 16 : 10);

    if (!Number.isNaN(val)) {
      colorArr.splice(channel, 1, channel === colorArr.length - 1 ? val / (format === "hex" ? 255 : 100) : val);
      setColor(generateCMStr(colorArr));
    }
  };

  return (
    <FlexColumn $gap={gap}>
      {colorArr.map((val, i) => {
        const isAlpha = i === colorArr.length - 1;
        const { color, title, min, max, postfix } = formattedProps;

        return (
          <FullSlider
            key={"slider-" + i}
            value={isAlpha ? val * (format === "hex" ? 255 : 100) : val}
            color={color[i]}
            title={isAlpha ? "A" : title[i]}
            min={min[i]}
            max={max[i]}
            postfix={postfix[i]}
            format={format}
            onChange={(e) => handleChange(e, i)}
          />
        );
      })}
    </FlexColumn>
  );
}
