import { Ihsla, Irgba, TChannel, TChannelHSL, TFormat } from "colormaster/types";
import React, { useMemo, useState } from "react";
import { Button, Checkbox, Divider, Dropdown, Grid, Icon, Input, Popup, Segment } from "semantic-ui-react";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./HSLSliderGroup";
import RangeSlider from "./RangeSlider";
import RGBSliderGroup from "./RGBSliderGroup";
import CM, { ColorMaster } from "colormaster";
import styled from "styled-components";

const options = [
  { key: 1, text: "RGB", value: 1 },
  { key: 2, text: "HEX", value: 2 },
  { key: 3, text: "HSL", value: 3 }
];

const StatisticsContainer = styled.div`
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
    & .menu > .item {
      text-align: center;
    }

    & .icon {
      position: absolute;
      right: 4px;
    }
  }
`;

const StyledButton = styled(Button.Group)`
  & .ui.basic.button {
    padding: 0;
  }
`;

type TValidColorSpaces = Exclude<TFormat, "name" | "invalid">;

interface ISliderGroupSelector {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  drawAlphaPicker?: (xPos: number) => void;
  drawHuePicker?: (xPos: number) => void;
  stats?: boolean;
}

export default function SliderGroupSelector({
  color,
  setColor,
  drawAlphaPicker,
  drawHuePicker,
  stats
}: ISliderGroupSelector): JSX.Element {
  const [picker, setPicker] = useState(1);
  const [withAlpha, setWithAlpha] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: TChannel | TChannelHSL) => {
    const val = Number.isNaN(e.target.valueAsNumber)
      ? e.target.value.length > 0
        ? parseInt(e.target.value, 16)
        : 0
      : e.target.valueAsNumber;

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

    const scaledAlpha = val / (picker === 2 ? 255 : 100);
    type === "alpha" && drawAlphaPicker?.(scaledAlpha * 400);
    (newColor as Ihsla).h !== h && drawHuePicker?.((h / 360) * 400);
    newColor.a = type === "alpha" ? scaledAlpha : color.alpha;

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

  const handlePickerAdjustment = (dir: "up" | "down") => {
    const numOptions = Object.keys(options).length;
    if (dir === "down") {
      setPicker(picker === 1 ? numOptions : picker - 1);
    } else {
      setPicker(picker === numOptions ? 1 : picker + 1);
    }
  };

  return stats ? (
    <Segment compact>
      <Swatch
        radius={50}
        background={picker === 1 ? color.stringRGB() : picker === 2 ? color.stringHEX() : color.stringHSL()}
      />

      <Divider hidden />

      <Grid columns={3} verticalAlign="middle" stackable>
        <Grid.Column width={1}>
          <StyledButton vertical>
            <Button icon="angle up" basic onClick={() => handlePickerAdjustment("up")} />
            <Button icon="angle down" basic onClick={() => handlePickerAdjustment("down")} />
          </StyledButton>
        </Grid.Column>

        <Grid.Column width={8}>
          <StyledDropdown
            icon={<Icon name="paint brush" color="grey" />}
            value={picker}
            options={options}
            labeled
            selection
            scrolling
            fluid
            onChange={(e: React.ChangeEvent, { value }: { value: number }) => setPicker(value)}
          />
        </Grid.Column>

        <Grid.Column width={6}>
          <Checkbox label="Show Alpha" checked={withAlpha} onChange={() => setWithAlpha(!withAlpha)} />
        </Grid.Column>
      </Grid>

      <Divider hidden />

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

          <Divider hidden />

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

          <Divider hidden />

          <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} format="hex" />
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

          <Divider hidden />

          <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
        </StatisticsContainer>
      )}

      {withAlpha && (
        <>
          <Divider hidden />
          <RangeSlider
            value={color.alpha * (picker === 2 ? 255 : 100)}
            color="rgba(0,0,0,0.5)"
            title="A"
            max={picker === 2 ? "255" : "100"}
            format={picker === 2 ? "hex" : undefined}
            postfix={picker === 2 ? "" : "%"}
            onChange={(e) => handleSliderChange(e, "alpha")}
          />
        </>
      )}
    </Segment>
  ) : (
    <></>
  );
}
