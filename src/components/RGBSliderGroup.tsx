import { Irgb, TChannel } from "colormaster/types";
import React from "react";
import { Divider } from "semantic-ui-react";
import RangeSlider from "./RangeSlider";

interface IRGBSliderGroup {
  rgb: Irgb;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannel) => void;
  format?: "hex" | "rgb";
}

export default function RGBSliderGroup({ rgb, onChange, format = "rgb" }: IRGBSliderGroup): JSX.Element {
  const { r, g, b } = rgb;
  return (
    <>
      <RangeSlider
        value={r}
        color="rgba(255, 0, 0, 1)"
        title="R"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "red")}
      />

      <Divider hidden />

      <RangeSlider
        value={g}
        color="rgba(0, 255, 0, 1)"
        title="G"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "green")}
      />

      <Divider hidden />

      <RangeSlider
        value={b}
        color="rgba(0, 0, 255, 1)"
        title="B"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "blue")}
      />
    </>
  );
}
