import React from "react";
import RangeSlider from "./RangeSlider";

type TState<T> = React.Dispatch<React.SetStateAction<T>>;

interface IRGBSliderGroup {
  red: number;
  setRed: TState<number>;
  green: number;
  setGreen: TState<number>;
  blue: number;
  setBlue: TState<number>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, setState: TState<number>) => void;
}

export default function RGBSliderGroup({
  red,
  setRed,
  green,
  setGreen,
  blue,
  setBlue,
  onChange
}: IRGBSliderGroup): JSX.Element {
  return (
    <>
      <RangeSlider value={red} color="rgba(255, 0, 0, 1)" title="R" max="255" onChange={(e) => onChange(e, setRed)} />

      <RangeSlider
        value={green}
        color="rgba(0, 255, 0, 1)"
        title="G"
        max="255"
        onChange={(e) => onChange(e, setGreen)}
      />

      <RangeSlider value={blue} color="rgba(0, 0, 255, 1)" title="B" max="255" onChange={(e) => onChange(e, setBlue)} />
    </>
  );
}
