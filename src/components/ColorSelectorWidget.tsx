import React, { useCallback, useMemo, useState } from "react";
import { Button, Divider, Dropdown, Grid, Header, Icon, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { Swatch } from "../styles/Swatch";
import HSLSliderGroup from "./Sliders/HSLSliderGroup";
import RGBSliderGroup from "./Sliders/RGBSliderGroup";
import CM, { ColorMaster } from "colormaster";
import { Ihsla, Irgba, TChannel, TChannelHSL, TFormat } from "colormaster/types";
import useBreakpointMap from "../hooks/useBreakpointMap";
import SketchPicker from "./Pickers/SketchPicker";
import WheelPicker from "./Pickers/WheelPicker";
import HEXSliderGroup from "./Sliders/HEXSliderGroup";
import ColorIndicator from "./ColorIndicator";
import useDebounce from "../hooks/useDebounce";

type TValidColorspace = Exclude<TFormat, "name" | "invalid">;
type TValidPicker = "slider" | "sketch" | "wheel";
type TColorspaceOpts = { key: TValidColorspace; text: `${Uppercase<TValidColorspace>}`; value: number }[];
type TPickerOpts = { key: TValidPicker; text: `${Uppercase<TValidPicker>}`; value: number }[];

const colorspaceOpts: TColorspaceOpts = [
  { key: "rgb", text: "RGB", value: 1 },
  { key: "hex", text: "HEX", value: 2 },
  { key: "hsl", text: "HSL", value: 3 }
];

const pickerOpts: TPickerOpts = [
  { key: "slider", text: "SLIDER", value: 1 },
  { key: "sketch", text: "SKETCH", value: 2 },
  { key: "wheel", text: "WHEEL", value: 3 }
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
  initColorspace?: TValidColorspace;
  initPicker?: TValidPicker;
  harmony?: ColorMaster[];
}

export default function ColorSelectorWidget({
  color,
  setColor,
  children,
  initColorspace = colorspaceOpts[0].key,
  initPicker = pickerOpts[0].key,
  harmony = undefined
}: IColorSelectorWidget): JSX.Element {
  const [alpha, setAlpha] = useState(true);
  const [swatchIndex, setSwatchIndex] = useState(0);
  const [colorspace, setColorspace] = useState(
    colorspaceOpts.find((x) => x.key === initColorspace) ?? colorspaceOpts[0]
  );
  const [picker, setPicker] = useState(pickerOpts.find((x) => x.key === initPicker) ?? pickerOpts[0]);

  const colorNameDebounce = useDebounce(color.name({ exact: false }), 100);

  const { isMobile } = useBreakpointMap();

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

      newColor.a = type === "alpha" ? val / (colorspace.key === "hex" ? 255 : 100) : color.alpha;

      setColor(CM(newColor));
    },
    [color, setColor, colorspace]
  );

  const currentSliders = useMemo(() => {
    const possibleSliders = [
      {
        type: "rgb",
        colorStr: color.stringRGB({ alpha, precision: [2, 2, 2, 2] }),
        sliders: <RGBSliderGroup rgb={color.rgba()} onChange={handleSliderChange} />
      },
      {
        type: "hex",
        colorStr: color.stringHEX({ alpha }),
        sliders: <HEXSliderGroup color={color} onChange={handleSliderChange} />
      },
      {
        type: "hsl",
        colorStr: color.stringHSL({ alpha, precision: [2, 2, 2, 2] }),
        sliders: <HSLSliderGroup hsl={color.hsla()} onChange={handleSliderChange} />
      }
    ];

    return possibleSliders.filter((slider) => slider.type === colorspace.key)[0];
  }, [colorspace, color, alpha, handleSliderChange]);

  const handleDropdownAdjustment = (dir: "up" | "down", type: "picker" | "colorspace") => {
    const numOptions = Object.keys(type === "colorspace" ? colorspaceOpts : pickerOpts).length;
    const value = (type === "colorspace" ? colorspace : picker).value;
    let newValue = 0;
    if (dir === "down") {
      newValue = value === 1 ? numOptions : value - 1;
    } else {
      newValue = value === numOptions ? 1 : value + 1;
    }

    if (type === "colorspace") setColorspace(colorspaceOpts[newValue - 1]);
    else setPicker(pickerOpts[newValue - 1]);
  };

  return (
    <Segment>
      {children}

      {isMobile && <Divider hidden />}

      <Grid verticalAlign="middle" centered stackable>
        <Grid.Row>
          <Swatch $radius={50} background={color.stringHSL()} title={color.stringHSL()} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h3" color="grey">
              {colorNameDebounce}
            </Header>
          </Grid.Column>
        </Grid.Row>

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
                $radius={15}
                $borderColor="rgba(0,0,0,0.3)"
                $borderRadius="4px"
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
              <Button icon="angle up" basic onClick={() => handleDropdownAdjustment("up", "colorspace")} />
              <Button icon="angle down" basic onClick={() => handleDropdownAdjustment("down", "colorspace")} />
            </StyledButton>
          </Grid.Column>

          {[{ key: "colorspace" }, { key: "picker" }].map((elem, i) => {
            return (
              <Grid.Column key={elem.key + "-column"} computer={6}>
                <StyledDropdown
                  icon={<Icon name={i === 0 ? "paint brush" : "crosshairs"} color="grey" />}
                  value={(i === 0 ? colorspace : picker).value}
                  options={i === 0 ? colorspaceOpts : pickerOpts}
                  labeled
                  selection
                  scrolling
                  fluid
                  onChange={(e: React.ChangeEvent, { value }: { value: number }) =>
                    i === 0
                      ? setColorspace({ ...colorspaceOpts[value - 1], value })
                      : setPicker({ ...pickerOpts[value - 1], value })
                  }
                />
              </Grid.Column>
            );
          })}

          <Grid.Column computer={1} only="computer">
            <StyledButton vertical>
              <Button icon="angle up" basic onClick={() => handleDropdownAdjustment("up", "picker")} />
              <Button icon="angle down" basic onClick={() => handleDropdownAdjustment("down", "picker")} />
            </StyledButton>
          </Grid.Column>
        </Grid.Row>

        <ColorIndicator color={currentSliders.colorStr} alpha={alpha} setAlpha={setAlpha} />
      </Grid>

      <Divider hidden />

      {picker.key === "sketch" ? (
        <SketchPicker color={color} setColor={setColor} verticalPickers={!isMobile} />
      ) : picker.key === "wheel" ? (
        <WheelPicker color={color} setColor={setColor} harmony={harmony} verticalPickers={!isMobile} />
      ) : (
        currentSliders.sliders
      )}
    </Segment>
  );
}
