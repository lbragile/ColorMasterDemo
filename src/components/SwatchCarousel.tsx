import React, { useRef, useState } from "react";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Swatch } from "../styles/Swatch";
import Spacers from "./Spacers";
import { StyledAngleIcon } from "./ColorSelectorWidget";
import CM from "colormaster";
import { FlexRow } from "../styles/Flex";
import useBreakpointMap from "../hooks/useBreakpointMap";

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

interface ISwatchCarousel {
  setColor: React.Dispatch<React.SetStateAction<ReturnType<typeof CM>>>;
  num?: number;
}

export default function SwatchCarousel({ setColor, num = 9 }: ISwatchCarousel): JSX.Element {
  const { isMobile, isTablet } = useBreakpointMap();
  const numVisibleSwatches = useRef(isMobile || isTablet ? 7 : num);
  const [swatchIndex, setSwatchIndex] = useState(0);

  return (
    <FlexRow $gap="4px">
      <StyledAngleIcon
        icon={faAngleLeft}
        color="gray"
        $disabled={swatchIndex === 0}
        onClick={() => swatchIndex > 0 && setSwatchIndex(swatchIndex - 1)}
      />

      <Spacers width="2px" />

      {SWATCH_COLORS.slice(swatchIndex, swatchIndex + numVisibleSwatches.current).map((background) => (
        <Swatch
          key={background + "-swatch"}
          title={background}
          background={background}
          onClick={() => setColor(CM(background))}
          $radius={15}
          $borderColor="rgba(0,0,0,0.3)"
          $borderRadius="4px"
          $cursor="pointer"
        />
      ))}

      <Spacers width="2px" />

      <StyledAngleIcon
        icon={faAngleRight}
        color="gray"
        $disabled={swatchIndex === SWATCH_COLORS.length - numVisibleSwatches.current}
        onClick={() =>
          swatchIndex < SWATCH_COLORS.length - numVisibleSwatches.current && setSwatchIndex(swatchIndex + 1)
        }
      />
    </FlexRow>
  );
}
