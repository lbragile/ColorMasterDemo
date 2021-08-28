import React, { useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Divider, Dropdown, Grid, Icon, Input, Popup, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./HSLSliderGroup";
import RangeSlider from "./RangeSlider";
import RGBSliderGroup from "./RGBSliderGroup";
import CM, { ColorMaster } from "colormaster";
import { Ihsla, Irgba, TChannel, TChannelHSL } from "colormaster/types";

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

const SwatchPicker = styled(Segment)`
  &.ui.segment {
    & .swatch-color {
      padding: 4px;

      &,
      & div {
        margin: 0;

        &:hover {
          cursor: pointer;
        }
      }
    }

    & .grid {
      display: block;

      .row {
        padding: 1px;
      }
    }
  }
`;

interface ISliderGroupSelector {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  initPicker?: number;
}

export default function SliderGroupSelector({ color, setColor, initPicker = 1 }: ISliderGroupSelector): JSX.Element {
  const [picker, setPicker] = useState(initPicker);
  const [withAlpha, setWithAlpha] = useState(true);
  const [copied, setCopied] = useState(false);

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
      <Grid columns={2} verticalAlign="middle" centered>
        <Grid.Column width={6}>
          <Swatch
            radius={50}
            background={picker === 1 ? color.stringRGB() : picker === 2 ? color.stringHEX() : color.stringHSL()}
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <SwatchPicker compact>
            <Grid columns={5}>
              <Grid.Row>
                {[
                  "hsl(0, 100%, 50%)",
                  "hsl(30, 100%, 50%)",
                  "hsl(60, 100%, 50%)",
                  "hsl(90, 100%, 50%)",
                  "hsl(0, 0%, 0%)"
                ].map((background) => (
                  <Grid.Column className="swatch-color" key={background + "-swatch"}>
                    <Swatch
                      radius={15}
                      borderColor="rgba(0,0,0,0.3)"
                      borderRadius="4px"
                      background={background}
                      onClick={() => setColor(CM(background))}
                    />
                  </Grid.Column>
                ))}
              </Grid.Row>
              <Grid.Row>
                {[
                  "hsl(120, 100%, 50%)",
                  "hsl(150, 100%, 50%)",
                  "hsl(180, 100%, 50%)",
                  "hsl(210, 100%, 50%)",
                  "hsl(0, 0%,50%)"
                ].map((background) => (
                  <Grid.Column className="swatch-color" key={background + "-swatch"}>
                    <Swatch
                      radius={15}
                      borderColor="rgba(0,0,0,0.3)"
                      borderRadius="4px"
                      background={background}
                      onClick={() => setColor(CM(background))}
                    />
                  </Grid.Column>
                ))}
              </Grid.Row>
              <Grid.Row>
                {[
                  "hsl(240, 100%, 50%)",
                  "hsl(270, 100%, 50%)",
                  "hsl(300, 100%, 50%)",
                  "hsl(330, 100%, 50%)",
                  "hsl(0, 0%, 100%)"
                ].map((background) => (
                  <Grid.Column className="swatch-color" key={background + "-swatch"}>
                    <Swatch
                      radius={15}
                      borderColor="rgba(0,0,0,0.3)"
                      borderRadius="4px"
                      background={background}
                      onClick={() => setColor(CM(background))}
                    />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </SwatchPicker>
        </Grid.Column>
      </Grid>

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

      <StatisticsContainer key={currentSliders.name}>
        <StyledColorDisplay
          type="text"
          value={currentSliders.value}
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
