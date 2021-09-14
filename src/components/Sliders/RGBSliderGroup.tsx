import React from "react";
import { Irgba, TChannel } from "colormaster/types";
import styled from "styled-components";
import FullSlider from "./FullSlider";

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

interface IRGBSliderGroup {
  rgb: Irgba;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannel) => void;
  format?: "hex" | "rgb";
}

export default function RGBSliderGroup({ rgb, onChange, format = "rgb" }: IRGBSliderGroup): JSX.Element {
  const { r, g, b, a } = rgb;
  return (
    <FlexColumn>
      <FullSlider
        value={r}
        color="rgba(255, 0, 0, 1)"
        title="R"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "red")}
      />

      <FullSlider
        value={g}
        color="rgba(0, 255, 0, 1)"
        title="G"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "green")}
      />

      <FullSlider
        value={b}
        color="rgba(0, 0, 255, 1)"
        title="B"
        max="255"
        format={format}
        onChange={(e) => onChange(e, "blue")}
      />

      <FullSlider
        value={a * (format === "hex" ? 255 : 100)}
        color="rgba(0,0,0,0.5)"
        title="A"
        max={format === "hex" ? "255" : "100"}
        format={format}
        postfix={format === "hex" ? "" : "%"}
        onChange={(e) => onChange(e, "alpha")}
      />
    </FlexColumn>
  );
}
