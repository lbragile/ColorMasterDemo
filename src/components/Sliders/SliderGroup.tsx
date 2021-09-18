import React, { useCallback, useMemo } from "react";
import FullSlider from "./FullSlider";
import { FlexColumn } from "../../styles/Flex";
import CM, { ColorMaster } from "colormaster";
import { TFormat, THexStr } from "colormaster/types";

interface ISliderGroup {
  colorArr: number[];
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  format: Exclude<TFormat, "name" | "invalid">;
  gap?: string;
}

export default function SliderGroup({ colorArr, setColor, format, gap = "" }: ISliderGroup): JSX.Element {
  const generateCMStr = useCallback(
    (arr: number[]): ColorMaster => {
      switch (format) {
        case "hsl":
          return CM({ h: arr[0], s: arr[1], l: arr[2], a: arr[3] });

        case "hex": {
          const formattedArr = arr.map(
            (val, i) => ("0" + Math.round(i === arr.length - 1 ? val * 255 : val).toString(16)).slice(-2) as THexStr
          );
          return CM({ r: formattedArr[0], g: formattedArr[1], b: formattedArr[2], a: formattedArr[3] });
        }

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
    const val = +e.target.value;

    if (!Number.isNaN(val)) {
      switch (channel) {
        case 0:
          setColor(generateCMStr([val, ...colorArr.slice(1)]));
          break;

        case 1:
          setColor(generateCMStr([colorArr[0], +e.target.value, ...colorArr.slice(2)]));
          break;

        case 2:
          setColor(generateCMStr([...colorArr.slice(0, 2), +e.target.value, colorArr[3]]));
          break;

        case 3:
          setColor(generateCMStr([...colorArr.slice(0, 3), +e.target.value / (format === "hex" ? 255 : 100)]));
          break;

        // no default
      }
    }
  };

  return (
    <FlexColumn $gap={gap}>
      {colorArr.map((val, i) => {
        const isAlpha = i === colorArr.length - 1;

        return (
          <FullSlider
            key={"slider-" + i}
            value={isAlpha ? val * (format === "hex" ? 255 : 100) : val}
            color={formattedProps.color[i]}
            title={isAlpha ? "A" : formattedProps.title[i]}
            min={formattedProps.min[i]}
            max={formattedProps.max[i]}
            postfix={formattedProps.postfix[i]}
            format={format}
            onChange={(e) => handleChange(e, i)}
          />
        );
      })}
    </FlexColumn>
  );
}
