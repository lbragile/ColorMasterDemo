import React, { useMemo } from "react";
import { ColorMaster } from "colormaster";
import SliderGroup from "../components/Sliders/SliderGroup";
import { TSetState } from "../types/react";
import { TValidColorspace } from "../types/colormaster";

interface IUseSliderChange {
  color: ColorMaster;
  setColor: TSetState<ColorMaster>;
  colorspace: string;
  alpha?: boolean;
  adjustors?: JSX.Element[];
}
interface IUseSliderChangeReturn {
  type: TValidColorspace;
  colorStr: string;
  sliders: JSX.Element;
}

export default function useSliderChange({
  color,
  setColor,
  colorspace,
  alpha,
  adjustors = undefined
}: IUseSliderChange): IUseSliderChangeReturn {
  const currentSliderChoice = useMemo(() => {
    const possibleSliders: IUseSliderChangeReturn[] = [
      {
        type: "rgb",
        colorStr: color.stringRGB({ alpha, precision: [0, 0, 0, 2] }),
        sliders: (
          <SliderGroup colorArr={Object.values(color.rgba()) as number[]} setColor={setColor} format="rgb" gap="28px">
            {adjustors}
          </SliderGroup>
        )
      },
      {
        type: "hex",
        colorStr: color.stringHEX({ alpha }),
        sliders: (
          <SliderGroup colorArr={Object.values(color.rgba()) as number[]} setColor={setColor} format="hex" gap="28px">
            {adjustors}
          </SliderGroup>
        )
      },
      {
        type: "hsl",
        colorStr: color.stringHSL({ alpha, precision: [0, 0, 0, 2] }),
        sliders: (
          <SliderGroup colorArr={Object.values(color.hsla()) as number[]} setColor={setColor} format="hsl" gap="28px">
            {adjustors}
          </SliderGroup>
        )
      }
    ];

    return possibleSliders.find((slider) => slider.type === colorspace) ?? possibleSliders[0];
  }, [colorspace, color, setColor, alpha, adjustors]);

  return currentSliderChoice;
}
