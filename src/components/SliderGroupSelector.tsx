import { Ihsla, Irgba, TChannel, TChannelHSL } from "colormaster/types";
import { useState } from "react";
import { Checkbox, Divider, Dropdown } from "semantic-ui-react";
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
    width: 30ch;
  }
`;

export default function SliderGroupSelector(): JSX.Element {
  const [picker, setPicker] = useState(1);
  const [color, setColor] = useState(CM("rgba(200, 125, 50, 1)"));
  const [withAlpha, setWithAlpha] = useState(true);

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

  function parseRGB(input: string) {
    const [r, g, b, a] = input
      .replace(/rgba\(|\)/g, "")
      .split(", ")
      .map((val) => +val);
    setColor(CM(withAlpha ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`));
  }

  return (
    <>
      <Swatch
        radius={50}
        background={picker === 1 ? color.stringRGB() : picker === 2 ? color.stringHEX() : color.stringHSL()}
      />

      <Divider hidden />

      <Dropdown value={picker} options={options} selection onChange={(e, { value }) => setPicker(value as number)} />

      <Divider hidden />

      <Checkbox label="Alpha?" toggle checked={withAlpha} onChange={() => setWithAlpha(!withAlpha)} />

      {picker === 1 ? (
        <StatisticsContainer>
          <input
            type="text"
            value={color.stringRGB({ alpha: withAlpha, precision: [2, 2, 2, 2] })}
            onChange={(e) => parseRGB(e.target.value)}
          />
          <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
        </StatisticsContainer>
      ) : picker === 2 ? (
        <StatisticsContainer>
          <input type="text" value={color.stringHEX({ alpha: withAlpha })} onChange={() => ""} />
          <HEXSliderGroup hex={color.hexa()} onChange={handleSliderChange} />
        </StatisticsContainer>
      ) : (
        <StatisticsContainer>
          <input
            type="text"
            value={color.stringHSL({ alpha: withAlpha, precision: [2, 2, 2, 2] })}
            onChange={() => ""}
          />
          <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
        </StatisticsContainer>
      )}

      {withAlpha && (
        <RangeSlider
          value={color.alpha * 100}
          color="rgba(0,0,0,0.5)"
          title="A"
          max="100"
          postfix="%"
          onChange={(e) => handleSliderChange(e, "alpha")}
        />
      )}
    </>
  );
}
