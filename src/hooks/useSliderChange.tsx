import React, { useMemo } from "react";
import { ColorMaster } from "colormaster";
import SliderGroup from "../components/Sliders/SliderGroup";
import { TFormat } from "colormaster/types";

interface IUseSliderChange {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  colorspace: string;
  alpha?: boolean;
  min?: string;
}
interface IUseSliderChangeReturn {
  type: Exclude<TFormat, "name" | "invalid">;
  colorStr: string;
  sliders: JSX.Element;
}

export default function useSliderChange({
  color,
  setColor,
  colorspace,
  alpha
}: IUseSliderChange): IUseSliderChangeReturn {
  const currentSliderChoice = useMemo(() => {
    const possibleSliders: IUseSliderChangeReturn[] = [
      {
        type: "rgb",
        colorStr: color.stringRGB({ alpha, precision: [2, 2, 2, 2] }),
        sliders: (
          <SliderGroup colorArr={Object.values(color.rgba()) as number[]} setColor={setColor} format="rgb" gap="28px" />
        )
      },
      {
        type: "hex",
        colorStr: color.stringHEX({ alpha }),
        sliders: (
          <SliderGroup colorArr={Object.values(color.rgba()) as number[]} setColor={setColor} format="hex" gap="28px" />
        )
      },
      {
        type: "hsl",
        colorStr: color.stringHSL({ alpha, precision: [2, 2, 2, 2] }),
        sliders: (
          <SliderGroup colorArr={Object.values(color.hsla()) as number[]} setColor={setColor} format="hsl" gap="28px" />
        )
      }
    ];

    return possibleSliders.find((slider) => slider.type === colorspace) ?? possibleSliders[0];
  }, [colorspace, color, setColor, alpha]);

  return currentSliderChoice;
}
