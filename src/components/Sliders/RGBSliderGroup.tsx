import React from "react";
import { Irgba, TChannel } from "colormaster/types";
import { Grid } from "semantic-ui-react";
import RangeSlider from "./RangeSlider";

interface IRGBSliderGroup {
  rgb: Irgba;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannel) => void;
  format?: "hex" | "rgb";
}

export default function RGBSliderGroup({ rgb, onChange, format = "rgb" }: IRGBSliderGroup): JSX.Element {
  const { r, g, b, a } = rgb;
  return (
    <Grid verticalAlign="middle" centered padded="vertically">
      <RangeSlider
        value={r}
        color="rgba(255, 0, 0, 1)"
        title="R"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "red")}
      />

      <RangeSlider
        value={g}
        color="rgba(0, 255, 0, 1)"
        title="G"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "green")}
      />

      <RangeSlider
        value={b}
        color="rgba(0, 0, 255, 1)"
        title="B"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "blue")}
      />

      <RangeSlider
        value={a * (format === "hex" ? 255 : 100)}
        color="rgba(0,0,0,0.5)"
        title="A"
        max={format === "hex" ? "255" : "100"}
        format={format}
        postfix={format === "hex" ? "" : "%"}
        onChange={(e) => onChange(e, "alpha")}
      />
    </Grid>
  );
}
