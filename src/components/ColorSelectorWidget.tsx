import React, { useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Divider, Dropdown, Grid, Icon, Input, Popup, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./Sliders/HSLSliderGroup";
import RGBSliderGroup from "./Sliders/RGBSliderGroup";
import CM, { ColorMaster } from "colormaster";
import { Ihsla, Irgba, TChannel, TChannelHSL } from "colormaster/types";
import useBreakpointMap from "../hooks/useBreakpointMap";
import SketchPicker from "./Pickers/SketchPicker";
import WheelPicker from "./Pickers/WheelPicker";
import HEXSliderGroup from "./Sliders/HEXSliderGroup";
import useCopyToClipboard from "../hooks/useCopytoClipboard";

const colorspaceOptions = [
  { key: 1, text: "RGB", value: 1 },
  { key: 2, text: "HEX", value: 2 },
  { key: 3, text: "HSL", value: 3 }
];

const pickerTypeOptions = [
  { key: 1, text: "SLIDER", value: 1 },
  { key: 2, text: "SKETCH", value: 2 },
  { key: 3, text: "WHEEL", value: 3 }
];

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

const StyledColorDisplay = styled(Input).attrs(
  (props: { $mobile: boolean; action: { color: string; [key: string]: unknown } }) => props
)`
  && {
    & > input {
      text-align: center;
      font-size: ${(props) => (props.$mobile ? "0.95em" : "1em")};
      padding: 0;
    }

    & .button:hover,
    & .button:focus {
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
      transform: translateY(-60%);
    }

    .left-swatch-arrow {
      transform: translate(-100%, -60%);
    }

    .swatch-color:hover,
    i:hover {
      cursor: pointer;
    }
  }
`;

interface IColorSelectorWidget {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  children?: JSX.Element;
  initColorspace?: number;
  initPicker?: number;
  harmony?: ColorMaster[];
}

export default function ColorSelectorWidget({
  color,
  setColor,
  children,
  initColorspace = 1,
  initPicker = 1,
  harmony = undefined
}: IColorSelectorWidget): JSX.Element {
  const [alpha, setAlpha] = useState(true);
  const [swatchIndex, setSwatchIndex] = useState(0);
  const [colorspace, setColorspace] = useState(initColorspace);
  const [pickerType, setPickerType] = useState(initPicker);

  const { isMobile } = useBreakpointMap();
  const [copy, setCopy] = useCopyToClipboard();

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

      newColor.a = type === "alpha" ? val / (colorspace === 2 ? 255 : 100) : color.alpha;

      setColor(CM(newColor));
    },
    [color, setColor, colorspace]
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
              trigger={<Icon name={copy ? "check circle" : "copy"} />}
            />
          ),
          color: copy ? "green" : "teal",
          onClick: () => setCopy(text),
          onBlur: () => setCopy("")
        };
      },
    [copy, setCopy]
  );

  const currentSliders = useMemo(() => {
    const possibleSliders = [
      {
        value: color.stringRGB({ alpha, precision: [2, 2, 2, 2] }),
        sliders: <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
      },
      {
        value: color.stringHEX({ alpha }),
        sliders: <HEXSliderGroup color={color} onChange={handleSliderChange} />
      },
      {
        value: color.stringHSL({ alpha, precision: [2, 2, 2, 2] }),
        sliders: <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
      }
    ];

    return possibleSliders[colorspace - 1];
  }, [colorspace, color, alpha, handleSliderChange]);

  const handleColorspaceAdjustment = (dir: "up" | "down") => {
    const numOptions = Object.keys(colorspaceOptions).length;
    if (dir === "down") {
      setColorspace(colorspace === 1 ? numOptions : colorspace - 1);
    } else {
      setColorspace(colorspace === numOptions ? 1 : colorspace + 1);
    }
  };

  const handlePickerAdjustment = (dir: "up" | "down") => {
    const numOptions = Object.keys(pickerTypeOptions).length;
    if (dir === "down") {
      setPickerType(pickerType === 1 ? numOptions : pickerType - 1);
    } else {
      setPickerType(pickerType === numOptions ? 1 : pickerType + 1);
    }
  };

  return (
    <Segment>
      {children}

      <Grid verticalAlign="middle" centered stackable>
        <Grid.Row>
          <Swatch
            radius={50}
            background={colorspace === 1 ? color.stringRGB() : colorspace === 2 ? color.stringHEX() : color.stringHSL()}
            title={color.stringHSL()}
          />
        </Grid.Row>

        {isMobile && <Divider hidden />}

        <Grid.Row>
          <SwatchSegment>
            <Icon
              className="left-swatch-arrow"
              size="large"
              name="angle left"
              disabled={swatchIndex === 0}
              onClick={() => setSwatchIndex(swatchIndex - 1)}
            />

            {SWATCH_COLORS.slice(swatchIndex, swatchIndex + (isMobile ? 7 : 12)).map((background) => (
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
              disabled={swatchIndex === SWATCH_COLORS.length - (isMobile ? 7 : 12)}
              onClick={() => setSwatchIndex(swatchIndex + 1)}
            />
          </SwatchSegment>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column computer={1} only="computer">
            <StyledButton vertical>
              <Button icon="angle up" basic onClick={() => handleColorspaceAdjustment("up")} />
              <Button icon="angle down" basic onClick={() => handleColorspaceAdjustment("down")} />
            </StyledButton>
          </Grid.Column>

          <Grid.Column computer={6}>
            <StyledDropdown
              icon={<Icon name="paint brush" color="grey" />}
              value={colorspace}
              options={colorspaceOptions}
              labeled
              selection
              scrolling
              fluid
              onChange={(e: React.ChangeEvent, { value }: { value: number }) => setColorspace(value)}
            />
          </Grid.Column>

          <Grid.Column computer={6}>
            <StyledDropdown
              icon={<Icon name="crosshairs" color="grey" />}
              value={pickerType}
              options={pickerTypeOptions}
              labeled
              selection
              scrolling
              fluid
              onChange={(e: React.ChangeEvent, { value }: { value: number }) => setPickerType(value)}
            />
          </Grid.Column>

          <Grid.Column computer={1} only="computer">
            <StyledButton vertical>
              <Button icon="angle up" basic onClick={() => handlePickerAdjustment("up")} />
              <Button icon="angle down" basic onClick={() => handlePickerAdjustment("down")} />
            </StyledButton>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column computer={12}>
            <StyledColorDisplay
              type="text"
              value={currentSliders.value}
              spellCheck={false}
              size="large"
              readOnly
              fluid
              action={copyAction(currentSliders.value)}
              $mobile={isMobile}
            />
          </Grid.Column>

          <Grid.Column computer={2}>
            <Checkbox label="Alpha" checked={alpha} onChange={() => setAlpha(!alpha)} />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Divider hidden />

      {pickerType === 2 ? (
        <SketchPicker color={color} setColor={setColor} verticalPickers={!isMobile} />
      ) : pickerType === 3 ? (
        <WheelPicker color={color} setColor={setColor} harmony={harmony} verticalPickers={!isMobile} />
      ) : (
        currentSliders.sliders
      )}
    </Segment>
  );
}
