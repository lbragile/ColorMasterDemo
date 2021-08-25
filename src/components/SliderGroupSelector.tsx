import { Ihsla, Irgba, TChannel, TChannelHSL } from "colormaster/types";
import { useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./HSLSliderGroup";
import RangeSlider from "./RangeSlider";
import RGBSliderGroup from "./RGBSliderGroup";
import CM from "colormaster";
import HEXSliderGroup from "./HEXSliderGroup";
import styled from "styled-components";

const options = [
  { key: 1, text: "RGB", value: 1 },
  { key: 2, text: "HEX", value: 2 },
  { key: 3, text: "HSL", value: 3 }
];

const StatisticsContainer = styled.div`
  margin: 2em 0;

  & > input {
    display: block;
    outline: none;
    border: none;
    border-bottom: 1px solid black;
    text-align: center;
    width: 15ch;
  }
`;

export default function SliderGroupSelector(): JSX.Element {
  const [picker, setPicker] = useState(1);
  const [color, setColor] = useState(CM("rgba(200, 125, 50, 1)"));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: TChannel | TChannelHSL) => {
    const val = e.target.valueAsNumber;
    const { r, g, b } = color.rgba();
    const { h, s, l } = color.hsla();

    const newColor: Irgba | Ihsla = ["red", "green", "blue"].includes(type)
      ? { r: type === "red" ? val : r, g: type === "green" ? val : g, b: type === "blue" ? val : b, a: 1 }
      : { h: type === "hue" ? val : h, s: type === "saturation" ? val : s, l: type === "lightness" ? val : l, a: 1 };

    newColor.a = type === "alpha" ? val / 100 : color.alpha;

    setColor(CM(newColor));
  };

  return (
    <>
      <Swatch
        radius={50}
        background={picker === 1 ? color.stringRGB() : picker === 2 ? color.stringHEX() : color.stringHSL()}
      />

      <Dropdown value={picker} options={options} selection onChange={(e, { value }) => setPicker(value as number)} />
      {picker === 1 ? (
        <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
      ) : picker === 2 ? (
        <StatisticsContainer>
          <input type="text" value={color.stringHEX()} onChange={() => ""} />
          <HEXSliderGroup hex={color.hexa()} onChange={handleSliderChange} />
        </StatisticsContainer>
      ) : (
        <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
      )}

      <RangeSlider
        value={color.alpha * 100}
        color="rgba(0,0,0,0.5)"
        title="A"
        max="100"
        postfix="%"
        onChange={(e) => handleSliderChange(e, "alpha")}
      />
    </>
  );
}
