import React from "react";
import RangeSlider from "./RangeSlider";

type TState<T> = React.Dispatch<React.SetStateAction<T>>;

interface IHSLSliderGroup {
  hue: number;
  setHue: TState<number>;
  saturation: number;
  setSaturation: TState<number>;
  lightness: number;
  setLightness: TState<number>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, setState: TState<number>) => void;
}

export default function HSLSliderGroup({
  hue,
  setHue,
  saturation,
  setSaturation,
  lightness,
  setLightness,
  onChange
}: IHSLSliderGroup): JSX.Element {
  return (
    <>
      <RangeSlider
        value={hue}
        color={`hsla(${hue}, 100%, 50%, 1)`}
        title="H"
        max="359.99"
        postfix="&deg;"
        onChange={(e) => onChange(e, setHue)}
      />

      <RangeSlider
        value={saturation}
        color={`hsla(${hue}, ${saturation}%, 50%, 1)`}
        title="S"
        max="100"
        postfix="%"
        onChange={(e) => onChange(e, setSaturation)}
      />

      <RangeSlider
        value={lightness}
        color={`hsla(0, 0%, ${lightness}%, 1)`}
        title="L"
        max="100"
        postfix="%"
        onChange={(e) => onChange(e, setLightness)}
      />
    </>
  );
}
