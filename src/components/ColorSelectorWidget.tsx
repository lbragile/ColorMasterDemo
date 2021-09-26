import React, { useContext, useState } from "react";
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
import { BreakpointsContext } from "./App";
import { FadeIn } from "../styles/Fade";

extendPlugins([NamePlugin]);

const colorspaceOpts = ["rgb", "hex", "hsl"];
const pickerOpts = ["slider", "sketch", "wheel"];

const BorderedSegment = styled(FlexColumn)`
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 2px 2px 6px 1px ${(props) => props.theme.colors.boxShadow};
  overflow: hidden;
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
  const { isMobile, isTablet, isLaptop, isComputer, isWideScreen } = useContext(BreakpointsContext);

  const [alpha, setAlpha] = useState(true);
  const [colorspace, setColorspace] = useState(colorspaceOpts.find((x) => x === initColorspace) ?? colorspaceOpts[0]);
  const [picker, setPicker] = useState(pickerOpts.find((x) => x === initPicker) ?? pickerOpts[0]);

  const colorNameDebounce = useDebounce(color.name({ exact: false }), 100);
  const currentSliders = useSliderChange({ color, setColor, colorspace, alpha });

  return (
    <BorderedSegment $cols={isMobile ? 24 : isTablet ? 16 : isLaptop ? 12 : isComputer ? 10 : isWideScreen ? 8 : 6}>
      {children}

      <Swatch $radius={50} background={color.stringHSL()} title={color.stringHSL()} $cursor="help" />

      <Spacers height="15px" />

      <Heading $size="h2">{colorNameDebounce}</Heading>

      <Spacers height="15px" />

      <SwatchCarousel setColor={setColor} />

      <Spacers height="30px" />

      <FlexRow>
        <Dropdown
          opts={colorspaceOpts}
          value={colorspace}
          setValue={setColorspace as React.Dispatch<React.SetStateAction<string>>}
          icon={<FontAwesomeIcon icon={faPalette} />}
          iconPos="left"
          switcherPos="left"
          cols={isMobile ? 10 : 8}
        />

        <Spacers width="10px" />

        <Dropdown
          opts={pickerOpts}
          value={picker}
          setValue={setPicker as React.Dispatch<React.SetStateAction<string>>}
          icon={<FontAwesomeIcon icon={faCrosshairs} />}
          iconPos="right"
          switcherPos="right"
          cols={isMobile ? 10 : 8}
        />
      </FlexRow>

      <Spacers height="30px" />

      <ColorIndicator color={currentSliders.colorStr} showName={false} alpha={alpha} setAlpha={setAlpha} />

      <Spacers height="30px" />

      {picker === "sketch" ? (
        <SketchPicker color={color} setColor={setColor} vertical />
      ) : picker === "wheel" ? (
        <WheelPicker color={color} setColor={setColor} harmony={harmony} vertical />
      ) : (
        <FadeIn>{currentSliders.sliders}</FadeIn>
      )}
    </BorderedSegment>
  );
}
