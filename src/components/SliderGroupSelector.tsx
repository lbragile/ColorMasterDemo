import { Ihsla, Irgba, TChannel, TChannelHSL, TFormat } from "colormaster/types";
import React, { useMemo, useState } from "react";
import { Checkbox, Divider, Dropdown, Grid, Icon, Input, Popup, Segment } from "semantic-ui-react";
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

const StyledColorDisplay = styled(Input)`
  &.ui.input {
    & > input {
      text-align: center;
    }

    &.action button:hover,
    &.action button:focus {
      background-color: ${(props) => (props.action.color === "teal" ? "rgba(0, 196, 196, 1)" : "rgba(0, 196, 0, 1)")};
    }
  }
`;

const StyledDropdown = styled(Dropdown)`
  &.ui.selection.dropdown {
    &,
    &.menu > .item {
      text-align: center;
    }
  }
`;

type TValidColorSpaces = Exclude<TFormat, "name" | "invalid">;

export default function SliderGroupSelector(): JSX.Element {
  const [picker, setPicker] = useState(1);
  const [color, setColor] = useState(CM("rgba(200, 125, 50, 1)"));
  const [withAlpha, setWithAlpha] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: TChannel | TChannelHSL) => {
    const val = Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;
    const { r, g, b } = color.rgba();
    const { h, s, l } = color.hsla();

    const newColor: Irgba | Ihsla = ["red", "green", "blue"].includes(type)
      ? { r: type === "red" ? val : r, g: type === "green" ? val : g, b: type === "blue" ? val : b, a: 1 }
      : {
          h: type === "hue" ? Math.max(0, Math.min(val, 359.99)) : h,
          s: type === "saturation" ? val : s,
          l: type === "lightness" ? val : l,
          a: 1
        };

    newColor.a = type === "alpha" ? val / 100 : color.alpha;

    setColor(CM(newColor));
  };

  const handleCopyClipboard = (type: TValidColorSpaces) => {
    const clipboardText =
      type === "hex"
        ? color.stringHEX({ alpha: withAlpha })
        : type === "hsl"
        ? color.stringHSL({ alpha: withAlpha, precision: [2, 2, 2, 2] })
        : color.stringRGB({ alpha: withAlpha, precision: [2, 2, 2, 2] });

    navigator.clipboard.writeText(clipboardText);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  const copyAction = useMemo(
    () =>
      function (type: TValidColorSpaces) {
        return {
          icon: (
            <Popup
              content="Copy to clipboard"
              position="top center"
              inverted
              trigger={<Icon name={copied ? "check circle" : "copy"} />}
            />
          ),
          color: copied ? "green" : "teal",
          onClick: () => handleCopyClipboard(type)
        };
      },
    [color, withAlpha, copied]
  );

  return (
    <Segment compact>
      <Swatch
        radius={50}
        background={picker === 1 ? color.stringRGB() : picker === 2 ? color.stringHEX() : color.stringHSL()}
      />

      <Divider hidden />

      <Grid verticalAlign="middle">
        <Grid.Column width={5}>
          <StyledDropdown
            value={picker}
            options={options}
            selection
            onChange={(e: React.ChangeEvent, { value }: { value: number }) => setPicker(value)}
          />
        </Grid.Column>

        <Grid.Column floated="right" width={6}>
          <Checkbox label="Show Alpha" checked={withAlpha} onChange={() => setWithAlpha(!withAlpha)} />
        </Grid.Column>
      </Grid>

      {picker === 1 ? (
        <StatisticsContainer>
          <StyledColorDisplay
            type="text"
            value={color.stringRGB({ alpha: withAlpha, precision: [2, 2, 2, 2] })}
            spellCheck={false}
            size="large"
            readOnly
            fluid
            action={copyAction("rgb")}
          />

          <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
        </StatisticsContainer>
      ) : picker === 2 ? (
        <StatisticsContainer>
          <StyledColorDisplay
            type="text"
            value={color.stringHEX({ alpha: withAlpha })}
            spellCheck={false}
            size="large"
            readOnly
            fluid
            action={copyAction("hex")}
          />
          <HEXSliderGroup hex={color.hexa()} onChange={handleSliderChange} />
        </StatisticsContainer>
      ) : (
        <StatisticsContainer>
          <StyledColorDisplay
            type="text"
            value={color.stringHSL({ alpha: withAlpha, precision: [2, 2, 2, 2] })}
            spellCheck={false}
            size="large"
            readOnly
            fluid
            action={copyAction("hsl")}
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
    </Segment>
  );
}
