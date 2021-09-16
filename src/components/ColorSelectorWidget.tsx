import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Swatch } from "../styles/Swatch";
import useBreakpointMap from "../hooks/useBreakpointMap";
import SketchPicker from "./Pickers/SketchPicker";
import WheelPicker from "./Pickers/WheelPicker";
import ColorIndicator, { Heading } from "./ColorIndicator";
import useDebounce from "../hooks/useDebounce";
import useSliderChange from "../hooks/useSliderChange";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import { FlexColumn } from "./Sliders/RGBSliderGroup";
import { FlexRow } from "./Sliders/FullSlider";
import Spacers from "./Spacers";
import Dropdown from "./Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faCrosshairs,
  faPalette
} from "@fortawesome/free-solid-svg-icons";

extendPlugins([NamePlugin]);

const colorspaceOpts = ["rgb", "hex", "hsl"];
const pickerOpts = ["slider", "sketch", "wheel"];

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

const BorderedSegment = styled.div`
  border: 1px solid hsla(0, 0%, 75%, 1);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 5px 5px 10px 1px rgba(102, 102, 102, 0.5);
`;

const StyledAngleIcon = styled(FontAwesomeIcon).attrs((props: { $disabled: boolean }) => props)`
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};

  & path {
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

    &:hover {
      fill: ${(props) => (props.$disabled ? "grey" : "black")};
    }
  }
`;
interface IColorSelectorWidget {
  color: ColorMaster;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  children?: JSX.Element;
  initColorspace?: string;
  initPicker?: string;
  harmony?: ColorMaster[];
}

export default function ColorSelectorWidget({
  color,
  setColor,
  children,
  initColorspace = colorspaceOpts[0],
  initPicker = pickerOpts[0],
  harmony = undefined
}: IColorSelectorWidget): JSX.Element {
  const numVisibleSwatches = useRef(9);

  const [alpha, setAlpha] = useState(true);
  const [swatchIndex, setSwatchIndex] = useState(0);
  const [colorspace, setColorspace] = useState(colorspaceOpts.find((x) => x === initColorspace) ?? colorspaceOpts[0]);
  const [picker, setPicker] = useState(pickerOpts.find((x) => x === initPicker) ?? pickerOpts[0]);

  const colorNameDebounce = useDebounce(color.name({ exact: false }), 100);
  const { isComputer, isWideScreen } = useBreakpointMap();
  const currentSliders = useSliderChange({ color, setColor, colorspace, alpha });

  const adjustSelection = (dir: "up" | "down", type: "picker" | "colorspace") => {
    const opts = type === "colorspace" ? colorspaceOpts : pickerOpts;
    const value = type === "colorspace" ? colorspace : picker;
    let newValue = "";
    const currentIndex = opts.indexOf(value);
    if (dir === "down") {
      newValue = currentIndex === 0 ? opts[opts.length - 1] : opts[currentIndex - 1];
    } else {
      newValue = currentIndex === opts.length - 1 ? opts[0] : opts[currentIndex + 1];
    }

    if (type === "colorspace") setColorspace(newValue);
    else setPicker(newValue);
  };

  return (
    <BorderedSegment>
      {children}

      <FlexColumn>
        <Swatch $radius={50} background={color.stringHSL()} title={color.stringHSL()} $cursor="help" />

        <Heading color="grey">{colorNameDebounce}</Heading>

        <FlexRow>
          <StyledAngleIcon
            icon={faAngleLeft}
            color="gray"
            $disabled={swatchIndex === 0}
            onClick={() => swatchIndex > 0 && setSwatchIndex(swatchIndex - 1)}
          />

          <Spacers width="4px" />

          {SWATCH_COLORS.slice(swatchIndex, swatchIndex + numVisibleSwatches.current).map((background) => (
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

          <Spacers width="4px" />

          <StyledAngleIcon
            icon={faAngleRight}
            color="gray"
            $disabled={swatchIndex === SWATCH_COLORS.length - numVisibleSwatches.current}
            onClick={() =>
              swatchIndex < SWATCH_COLORS.length - numVisibleSwatches.current && setSwatchIndex(swatchIndex + 1)
            }
          />
        </FlexRow>

        <Spacers height="30px" />

        <FlexRow>
          <FlexColumn>
            <StyledAngleIcon icon={faAngleUp} color="gray" onClick={() => adjustSelection("up", "colorspace")} />
            <StyledAngleIcon icon={faAngleDown} color="gray" onClick={() => adjustSelection("down", "colorspace")} />
          </FlexColumn>

          <Spacers width="5px" />

          <Dropdown
            opts={colorspaceOpts}
            value={colorspace}
            setValue={setColorspace as React.Dispatch<React.SetStateAction<string>>}
            icon={<FontAwesomeIcon icon={faPalette} color="dimgray" />}
            iconPos="left"
            cols={8}
          />

          <Spacers width="10px" />

          <Dropdown
            opts={pickerOpts}
            value={picker}
            setValue={setPicker as React.Dispatch<React.SetStateAction<string>>}
            icon={<FontAwesomeIcon icon={faCrosshairs} color="dimgray" />}
            iconPos="right"
            cols={8}
          />

          <Spacers width="5px" />

          <FlexColumn>
            <StyledAngleIcon icon={faAngleUp} color="gray" onClick={() => adjustSelection("up", "picker")} />
            <StyledAngleIcon icon={faAngleDown} color="gray" onClick={() => adjustSelection("down", "picker")} />
          </FlexColumn>
        </FlexRow>

        <Spacers height="30px" />

        <ColorIndicator color={currentSliders.colorStr} showName={false} alpha={alpha} setAlpha={setAlpha} />

        <Spacers height="30px" />

        {picker === "sketch" ? (
          <SketchPicker color={color} setColor={setColor} verticalPickers={isComputer || isWideScreen} />
        ) : picker === "wheel" ? (
          <WheelPicker
            color={color}
            setColor={setColor}
            harmony={harmony}
            verticalPickers={isComputer || isWideScreen}
          />
        ) : (
          currentSliders.sliders
        )}
      </FlexColumn>
    </BorderedSegment>
  );
}
