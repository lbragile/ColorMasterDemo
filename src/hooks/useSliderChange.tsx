import React, { useCallback, useMemo } from "react";
import { TChannel, TChannelHSL, Irgba, Ihsla, TFormat } from "colormaster/types";
import CM, { ColorMaster } from "colormaster";
import HEXSliderGroup from "../components/Sliders/HEXSliderGroup";
import HSLSliderGroup from "../components/Sliders/HSLSliderGroup";
import RGBSliderGroup from "../components/Sliders/RGBSliderGroup";

type TValidFormat = Exclude<TFormat, "name" | "invalid">;

interface IUseSliderChange {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  colorspace: TValidFormat;
  alpha?: boolean;
  min?: string;
}
interface IUseSliderChangeReturn {
  type: TValidFormat;
  colorStr: string;
  sliders: JSX.Element;
}

export default function useSliderChange({
  color,
  setColor,
  colorspace,
  alpha,
  min = "0"
}: IUseSliderChange): IUseSliderChangeReturn {
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: TChannel | TChannelHSL) => {
      const val = Number.isNaN(e.target.valueAsNumber)
        ? e.target.value.length > 0
          ? parseInt(e.target.value, 16)
          : 0
        : e.target.valueAsNumber;

      const { r, g, b } = color.rgba();
      const { h, s, l } = color.hsla();

      const newColor: Irgba | Ihsla = ["red", "green", "blue"].includes(type)
        ? { r: type === "red" ? val : r, g: type === "green" ? val : g, b: type === "blue" ? val : b, a: 1 }
        : {
            h: type === "hue" ? Math.max(0, Math.min(val, 359.99)) : h,
            s: type === "saturation" ? val : s,
            l: type === "lightness" ? val : l,
            a: 1
          };

      newColor.a = type === "alpha" ? val / (colorspace === "hex" ? 255 : 100) : color.alpha;

      setColor(CM(newColor));
    },
    [color, setColor, colorspace]
  );

  const currentSliderChoice = useMemo(() => {
    const possibleSliders: IUseSliderChangeReturn[] = [
      {
        type: "rgb",
        colorStr: color.stringRGB({ alpha, precision: [2, 2, 2, 2] }),
        sliders: <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
      },
      {
        type: "hex",
        colorStr: color.stringHEX({ alpha }),
        sliders: <HEXSliderGroup color={color} onChange={handleSliderChange} />
      },
      {
        type: "hsl",
        colorStr: color.stringHSL({ alpha, precision: [2, 2, 2, 2] }),
        sliders: <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} min={min} />
      }
    ];

    return possibleSliders.filter((slider) => slider.type === colorspace)[0];
  }, [colorspace, color, alpha, handleSliderChange, min]);

  return currentSliderChoice;
}
