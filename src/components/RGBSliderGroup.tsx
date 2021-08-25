import { Irgb, TChannel } from "colormaster/types";
import React from "react";
import RangeSlider from "./RangeSlider";

interface IRGBSliderGroup {
  rgb: Irgb;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannel) => void;
}

export default function RGBSliderGroup({ rgb, onChange }: IRGBSliderGroup): JSX.Element {
  const { r, g, b } = rgb;
  return (
    <>
      <RangeSlider value={r} color="rgba(255, 0, 0, 1)" title="R" max="255" onChange={(e) => onChange(e, "red")} />
      <RangeSlider value={g} color="rgba(0, 255, 0, 1)" title="G" max="255" onChange={(e) => onChange(e, "green")} />
      <RangeSlider value={b} color="rgba(0, 0, 255, 1)" title="B" max="255" onChange={(e) => onChange(e, "blue")} />
    </>
  );
}
