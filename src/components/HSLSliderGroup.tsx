import { Ihsl, TChannelHSL } from "colormaster/types";
import React from "react";
import RangeSlider from "./RangeSlider";

interface IHSLSliderGroup {
  hsl: Ihsl;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannelHSL) => void;
}

export default function HSLSliderGroup({ hsl, onChange }: IHSLSliderGroup): JSX.Element {
  const { h, s, l } = hsl;

  return (
    <>
      <RangeSlider
        value={h}
        color={`hsla(${h}, 100%, 50%, 1)`}
        title="H"
        max="359.99"
        postfix="&deg;"
        onChange={(e) => onChange(e, "hue")}
      />

      <RangeSlider
        value={s}
        color={`hsla(${h}, ${s}%, 50%, 1)`}
        title="S"
        max="100"
        postfix="%"
        onChange={(e) => onChange(e, "saturation")}
      />

      <RangeSlider
        value={l}
        color={`hsla(0, 0%, ${l}%, 1)`}
        title="L"
        max="100"
        postfix="%"
        onChange={(e) => onChange(e, "lightness")}
      />
    </>
  );
}
