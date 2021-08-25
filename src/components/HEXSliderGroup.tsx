import React from "react";
import { Ihex, TChannel } from "colormaster/types";
import RangeSlider from "./RangeSlider";

interface IHEXSliderGroup {
  hex: Ihex;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannel) => void;
}

export default function HEXSliderGroup({ hex, onChange }: IHEXSliderGroup): JSX.Element {
  const { r, g, b } = hex;
  return (
    <>
      <RangeSlider
        value={parseInt(r, 16)}
        color="rgba(255, 0, 0, 1)"
        title="R"
        max="255"
        onChange={(e) => onChange(e, "red")}
      />
      <RangeSlider
        value={parseInt(g, 16)}
        color="rgba(0, 255, 0, 1)"
        title="G"
        max="255"
        onChange={(e) => onChange(e, "green")}
      />
      <RangeSlider
        value={parseInt(b, 16)}
        color="rgba(0, 0, 255, 1)"
        title="B"
        max="255"
        onChange={(e) => onChange(e, "blue")}
      />
    </>
  );
}
