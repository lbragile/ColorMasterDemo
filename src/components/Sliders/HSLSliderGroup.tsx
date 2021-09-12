import { Ihsla, TChannelHSL } from "colormaster/types";
import React from "react";
import { Grid } from "semantic-ui-react";
import RangeSlider from "./RangeSlider";

interface IHSLSliderGroup {
  hsl: Ihsla;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannelHSL) => void;
  min?: string;
}

export default function HSLSliderGroup({ hsl, onChange, min = "0" }: IHSLSliderGroup): JSX.Element {
  const { h, s, l, a } = hsl;

  return (
    <Grid verticalAlign="middle" centered>
      <RangeSlider
        value={h}
        color={`hsla(${h}, 100%, 50%, 1)`}
        title="H"
        min={min}
        max="359.99"
        postfix="&deg;"
        onChange={(e) => onChange(e, "hue")}
      />

      <RangeSlider
        value={s}
        color={`hsla(${h}, ${s}%, 50%, 1)`}
        title="S"
        min={min}
        max="100"
        postfix="%"
        onChange={(e) => onChange(e, "saturation")}
      />

      <RangeSlider
        value={l}
        color={`hsla(0, 0%, ${l - 5}%, 1)`}
        title="L"
        min={min}
        max="100"
        postfix="%"
        onChange={(e) => onChange(e, "lightness")}
      />

      <RangeSlider
        value={a * 100}
        color="rgba(0,0,0,0.5)"
        title="A"
        min={min}
        max="100"
        postfix={"%"}
        onChange={(e) => onChange(e, "alpha")}
      />
    </Grid>
  );
}
