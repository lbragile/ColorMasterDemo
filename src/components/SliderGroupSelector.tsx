import React, { useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Divider, Dropdown, Grid, Icon, Input, Popup, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./HSLSliderGroup";
import RangeSlider from "./RangeSlider";
import RGBSliderGroup from "./RGBSliderGroup";
import CM, { ColorMaster } from "colormaster";
import { Ihsla, Irgba, TChannel, TChannelHSL } from "colormaster/types";
import useIsMobile from "../hooks/useIsMobile";

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
  && {
    & > input {
      text-align: center;
      font-size: ${(props) => (props.mobile === "true" ? "0.95em" : "1em")};
      padding: 0;
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

const SwatchSegment = styled(Segment)`
  && {
    margin: auto;
    border: none;
    box-shadow: none;
    padding: 0;

    .left-swatch-arrow,
    .right-swatch-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .left-swatch-arrow {
      transform: translate(-100%, -50%);
    }

    .swatch-color:hover,
    i:hover {
      cursor: pointer;
    }
  }
`;

interface ISliderGroupSelector {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  initPicker?: number;
}

const SWATCH_COLORS = [
  "hsla(0, 100%, 50%, 1)",
  "hsla(30, 100%, 50%, 1)",
  "hsla(60, 100%, 50%, 1)",
  "hsla(90, 100%, 50%, 1)",
  "hsla(120, 100%, 50%, 1)",
  "hsla(150, 100%, 50%, 1)",
  "hsla(180, 100%, 50%, 1)",
  "hsla(210, 100%, 50%, 1)",
  "hsla(240, 100%, 50%, 1)",
  "hsla(270, 100%, 50%, 1)",
  "hsla(300, 100%, 50%, 1)",
  "hsla(330, 100%, 50%, 1)",
  "hsla(0, 0%, 100%, 1)",
  "hsla(0, 0%, 75%, 1)",
  "hsla(0, 0%,50%, 1)",
  "hsla(0, 0%,25%, 1)",
  "hsla(0, 0%, 0%, 1)"
];

export default function SliderGroupSelector({ color, setColor, initPicker = 1 }: ISliderGroupSelector): JSX.Element {
  const [picker, setPicker] = useState(initPicker);
  const [withAlpha, setWithAlpha] = useState(true);
  const [copied, setCopied] = useState(false);
  const [swatchIndex, setSwatchIndex] = useState(0);

  const isMobile = useIsMobile();

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: TChannel | TChannelHSL) => {
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

      newColor.a = type === "alpha" ? val / (picker === 2 ? 255 : 100) : color.alpha;

      setColor(CM(newColor));
    },
    [color, picker, setColor]
  );

  const copyAction = useMemo(
    () =>
      function (text: string) {
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
          onClick: () => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }
        };
      },
    [copied]
  );

  const currentSliders = useMemo(() => {
    const possibleSliders = [
      {
        name: "rgb-sliders",
        value: color.stringRGB({ alpha: withAlpha, precision: [2, 2, 2, 2] }),
        sliders: <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
      },
      {
        name: "hex-sliders",
        value: color.stringHEX({ alpha: withAlpha }),
        sliders: <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} format="hex" />
      },
      {
        name: "hsl-sliders",
        value: color.stringHSL({ alpha: withAlpha, precision: [2, 2, 2, 2] }),
        sliders: <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
      }
    ];

    return possibleSliders[picker - 1];
  }, [picker, color, withAlpha, handleSliderChange]);

  const handlePickerAdjustment = (dir: "up" | "down") => {
    const numOptions = Object.keys(options).length;
    if (dir === "down") {
      setPicker(picker === 1 ? numOptions : picker - 1);
    } else {
      setPicker(picker === numOptions ? 1 : picker + 1);
    }
  };

  return (
    <Segment compact>
      <Swatch
        radius={50}
        background={picker === 1 ? color.stringRGB() : picker === 2 ? color.stringHEX() : color.stringHSL()}
      />

      <Divider hidden />

      <SwatchSegment compact size="mini">
        <Icon
          className="left-swatch-arrow"
          size="large"
          name="angle left"
          disabled={swatchIndex === 0}
          onClick={() => setSwatchIndex(swatchIndex - 1)}
        />

        {SWATCH_COLORS.slice(swatchIndex, swatchIndex + 9).map((background) => (
          <Swatch
            className="swatch-color"
            key={background + "-swatch"}
            title={background}
            radius={15}
            borderColor="rgba(0,0,0,0.3)"
            borderRadius="4px"
            display="inline-block"
            background={background}
            onClick={() => setColor(CM(background))}
          />
        ))}

        <Icon
          className="right-swatch-arrow"
          size="large"
          name="angle right"
          disabled={swatchIndex === SWATCH_COLORS.length - 9}
          onClick={() => setSwatchIndex(swatchIndex + 1)}
        />
      </SwatchSegment>

      <Divider hidden />

      <Grid columns={3} verticalAlign="middle" centered>
        <Grid.Column width={1}>
          <StyledButton vertical>
            <Button icon="angle up" basic onClick={() => handlePickerAdjustment("up")} />
            <Button icon="angle down" basic onClick={() => handlePickerAdjustment("down")} />
          </StyledButton>
        </Grid.Column>

        <Grid.Column width={9}>
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

        <Grid.Column>
          <Checkbox label="Show Alpha" checked={withAlpha} onChange={() => setWithAlpha(!withAlpha)} />
        </Grid.Column>
      </Grid>

      <Divider hidden />

      <StatisticsContainer>
        <StyledColorDisplay
          type="text"
          value={currentSliders.value}
          mobile={isMobile.toString()}
          spellCheck={false}
          size="large"
          readOnly
          fluid
          action={copyAction(currentSliders.value)}
        />

        <Divider hidden />

        {currentSliders.sliders}
      </StatisticsContainer>

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
  );
}
