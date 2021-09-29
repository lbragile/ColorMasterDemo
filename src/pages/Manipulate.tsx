import React, { useCallback, useContext, useEffect, useState } from "react";
import CodeModal from "../components/CodeModal";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import Spacers from "../components/Spacers";
import useDebounce from "../hooks/useDebounce";
import addColor from "../utils/addColor";
import { ManipulationSample } from "../utils/codeSamples";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Ihsla } from "colormaster/types";
import { Label } from "../styles/Label";
import FullSlider from "../components/Sliders/FullSlider";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import { BreakpointsContext } from "../components/App";
import { FadeIn } from "../styles/Fade";
import useLocalStorage from "../hooks/useLocalStorage";
import { IAlphaManipulation, IGridRowDetails } from "../types/grid";
import GridRow from "../components/GridRow";

extendPlugins([A11yPlugin]);

const INFORMATIVE_TEXT = {
  adjust:
    "Color picker & each of the above sliders!\nCombines both color picker (input) and slider (delta)\ncolors according to dropdown selection.",
  rotate:
    "Color picker & hue slider from above sliders only!\nRotation is simply moving at a fixed radius\n(arc) along the color wheel.",
  invert:
    'Based on "Adjust". Similar to complementary harmony.\nRotates 180° and flips the lightness value.\nAlpha channel included based on selection.',
  grayscale:
    'Based on "Adjust". Output will vary slightly in most cases.\nLarge variance if lightness is changed.\nCentered on 2D color wheel for all lightness values.'
};

const AdjustIcon = styled(FontAwesomeIcon).attrs((props: { $active: boolean }) => props)`
  color: ${(props) => (props.$active ? props.theme.arrowColor : props.theme.arrowColorHover)};
  cursor: pointer;
`;

export default function Manipulate(): JSX.Element {
  const { isMobile, isTablet, isLaptop, isComputer } = useContext(BreakpointsContext);

  const [alpha, setAlpha] = useLocalStorage<IAlphaManipulation>("alphaGridManipulate", {
    adjust: true,
    rotate: true,
    invert: true,
    grayscale: true
  });

  const [color, setColor] = useLocalStorage("leftWidget", CM("hsla(180, 50%, 50%, 0.5)"));
  const [incrementColor, setIncrementColor] = useLocalStorage("adjustColor", CM("hsla(72, 15%, 10%, 0.05)"));
  const [incrementArr, setIncrementArr] = useLocalStorage<boolean[]>("adjustDirection", new Array(4).fill(true));

  const [adjust, setAdjust] = useState(addColor(color, incrementColor, incrementArr));

  const colorDebounce = useDebounce(color, 100);
  const incrementColorDebounce = useDebounce(incrementColor, 100);

  useEffect(() => {
    setAdjust(addColor(color, incrementColor, incrementArr));
  }, [color, incrementColor, alpha.invert, incrementArr]);

  const handleChange = useCallback(
    (channel: keyof Ihsla) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = +e.target.value;

        if (!Number.isNaN(val)) {
          setIncrementColor(CM({ ...incrementColor.hsla(), [channel]: channel === "a" ? val / 100 : val }));
        }
      };
    },
    [incrementColor, setIncrementColor]
  );

  const IncrementOrDecrement = ({ channel }: { channel: number }): JSX.Element => {
    const newArr = [...incrementArr];
    newArr.splice(channel, 0, !incrementArr[channel]);

    return (
      <FlexColumn $cols={1}>
        <AdjustIcon
          icon={faPlus}
          $active={incrementArr[channel]}
          onClick={() => setIncrementArr(newArr)}
          aria-label="Trigger to increment channel by adjustment color"
        />
        <AdjustIcon
          icon={faMinus}
          $active={!incrementArr[channel]}
          onClick={() => setIncrementArr(newArr)}
          aria-label="Trigger to decrement channel by adjustment color"
        />
      </FlexColumn>
    );
  };

  return (
    <FadeIn $wrap="wrap" $gap={isMobile || isTablet ? "32px" : "28px"}>
      <ColorSelectorWidget
        color={color}
        setColor={setColor}
        initPicker="wheel"
        initColorspace="hsl"
        harmony={[
          color,
          adjust,
          CM({ ...color.hsla(), h: adjust.hue }),
          CM(adjust.hsla()).invert({ alpha: alpha.invert }),
          CM(adjust.hsla()).grayscale()
        ]}
      >
        <Label $where="left" $bgColor="hsla(0, 0%, 90%, 1)" $color="black">
          1
        </Label>
      </ColorSelectorWidget>

      <FlexColumn $cols={isMobile ? 24 : isTablet ? 20 : isLaptop ? 10 : isComputer ? 8 : 5} $gap="12px">
        <FlexRow>
          <FullSlider
            color={`hsla(${incrementColor.hue}, 100%, 50%, 1)`}
            value={incrementColor.hue}
            onChange={handleChange("h")}
            min="0"
            max="359.99"
            format="hsl"
            postfix="°"
            title="H"
          />

          <Spacers width="6px" />

          <IncrementOrDecrement channel={0} />
        </FlexRow>
        <FlexRow>
          <FullSlider
            color={`hsla(${incrementColor.hue}, ${incrementColor.saturation}%, 50%, 1)`}
            min="0.01"
            max="100"
            value={incrementColor.saturation}
            onChange={handleChange("s")}
            format="hsl"
            postfix="%"
            title="S"
          />

          <Spacers width="6px" />

          <IncrementOrDecrement channel={1} />
        </FlexRow>
        <FlexRow>
          <FullSlider
            color={`hsla(0, 0%, ${incrementColor.lightness - 5}%, 1)`}
            min="0.01"
            max="100"
            value={incrementColor.lightness}
            onChange={handleChange("l")}
            format="hsl"
            postfix="%"
            title="L"
          />

          <Spacers width="6px" />

          <IncrementOrDecrement channel={2} />
        </FlexRow>
        <FlexRow>
          <FullSlider
            color="rgba(0, 0, 0, 0.6)"
            min="0"
            max="100"
            value={incrementColor.alpha * 100}
            onChange={handleChange("a")}
            format="hsl"
            postfix="%"
            title="A"
          />

          <Spacers width="6px" />

          <IncrementOrDecrement channel={3} />
        </FlexRow>
      </FlexColumn>

      <FlexColumn $cols={isMobile || isTablet ? 24 : isLaptop ? 20 : isComputer ? 16 : 10} $gap="24px">
        {(
          [
            [
              { type: "adjust", text: INFORMATIVE_TEXT.adjust, state: adjust },
              { type: "rotate", text: INFORMATIVE_TEXT.rotate, state: CM({ ...color.hsla(), h: adjust.hue }) }
            ],
            [
              {
                type: "invert",
                text: INFORMATIVE_TEXT.invert,
                state: CM(adjust.hsla()).invert({ alpha: alpha.invert })
              },
              { type: "grayscale", text: INFORMATIVE_TEXT.grayscale, state: CM(adjust.hsla()).grayscale() }
            ]
          ] as IGridRowDetails[][]
        ).map((arr, i) => (
          <GridRow
            key={arr[0].type + arr[1].type}
            arr={arr}
            startCount={(i + 1) * 2}
            page="manipulate"
            setColor={setColor}
            alpha={alpha}
            setAlpha={setAlpha as React.Dispatch<React.SetStateAction<Partial<IAlphaManipulation>>>}
          />
        ))}

        <CodeModal code={ManipulationSample(colorDebounce, incrementColorDebounce, incrementArr, alpha)} />
      </FlexColumn>
    </FadeIn>
  );
}
