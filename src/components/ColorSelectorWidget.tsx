import React, { useState } from "react";
import styled from "styled-components";
import { Swatch } from "../styles/Swatch";
import SketchPicker from "./Pickers/SketchPicker";
import WheelPicker from "./Pickers/WheelPicker";
import ColorIndicator from "./ColorIndicator";
import useDebounce from "../hooks/useDebounce";
import useSliderChange from "../hooks/useSliderChange";
import { ColorMaster, extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import Spacers from "./Spacers";
import Dropdown from "./Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faPalette } from "@fortawesome/free-solid-svg-icons";
import SwatchCarousel from "./SwatchCarousel";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { Heading } from "../styles/Heading";
import useBreakpointMap from "../hooks/useBreakpointMap";

extendPlugins([NamePlugin]);

const colorspaceOpts = ["rgb", "hex", "hsl"];
const pickerOpts = ["slider", "sketch", "wheel"];

const BorderedSegment = styled.div`
  position: relative;
  border: 1px solid hsla(0, 0%, 75%, 1);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 5px 5px 10px 1px rgba(102, 102, 102, 0.5);
  width: 100%;
`;

export const StyledAngleIcon = styled(FontAwesomeIcon).attrs((props: { $disabled: boolean }) => props)`
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
  const { isMobile } = useBreakpointMap();

  const [alpha, setAlpha] = useState(true);
  const [colorspace, setColorspace] = useState(colorspaceOpts.find((x) => x === initColorspace) ?? colorspaceOpts[0]);
  const [picker, setPicker] = useState(pickerOpts.find((x) => x === initPicker) ?? pickerOpts[0]);

  const colorNameDebounce = useDebounce(color.name({ exact: false }), 100);
  const currentSliders = useSliderChange({ color, setColor, colorspace, alpha });

  return (
    <BorderedSegment>
      {children}
      <FlexColumn>
        <Swatch $radius={50} background={color.stringHSL()} title={color.stringHSL()} $cursor="help" />

        <Spacers height="15px" />

        <Heading $color="grey" $size="h2">
          {colorNameDebounce}
        </Heading>

        <Spacers height="15px" />

        <SwatchCarousel setColor={setColor} />

        <Spacers height="30px" />

        <FlexRow>
          <Dropdown
            opts={colorspaceOpts}
            value={colorspace}
            setValue={setColorspace as React.Dispatch<React.SetStateAction<string>>}
            icon={<FontAwesomeIcon icon={faPalette} color="dimgray" />}
            iconPos="left"
            switcherPos="left"
            cols={isMobile ? 10 : 8}
          />

          <Spacers width="10px" />

          <Dropdown
            opts={pickerOpts}
            value={picker}
            setValue={setPicker as React.Dispatch<React.SetStateAction<string>>}
            icon={<FontAwesomeIcon icon={faCrosshairs} color="dimgray" />}
            iconPos="right"
            switcherPos="right"
            cols={isMobile ? 10 : 8}
          />
        </FlexRow>

        <Spacers height="30px" />

        <ColorIndicator color={currentSliders.colorStr} showName={false} alpha={alpha} setAlpha={setAlpha} />

        <Spacers height="30px" />

        {picker === "sketch" ? (
          <SketchPicker color={color} setColor={setColor} verticalPickers />
        ) : picker === "wheel" ? (
          <WheelPicker color={color} setColor={setColor} harmony={harmony} verticalPickers />
        ) : (
          currentSliders.sliders
        )}
      </FlexColumn>
    </BorderedSegment>
  );
}
