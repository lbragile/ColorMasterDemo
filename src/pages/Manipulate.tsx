import React, { useContext, useEffect, useState } from "react";
import CodeModal from "../components/CodeModal";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import useDebounce from "../hooks/useDebounce";
import addColor from "../utils/addColor";
import { ManipulationSample } from "../utils/codeSamples";
import { FlexColumn } from "../styles/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Label } from "../styles/Label";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import { BreakpointsContext } from "../components/App";
import { FadeIn } from "../styles/Fade";
import useLocalStorage from "../hooks/useLocalStorage";
import { IAlphaManipulation, IGridRowDetails } from "../types/grid";
import GridRow from "../components/GridRow";
import { TSetState } from "../types/react";

extendPlugins([A11yPlugin]);

const INFORMATIVE_TEXT = {
  adjust:
    "Combines both input and adjustor color picker values.\nThe combination is based on the adjustor color\npicker increment/decrement switches.",
  rotate:
    "Input color picker & hue slider of adjustor color picker!\nRotation is simply moving at a fixed radius\n(arc) along the color wheel.",
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
  const { isMobile, isTablet, isLaptop, isComputer, isWideScreen } = useContext(BreakpointsContext);

  const [alpha, setAlpha] = useLocalStorage<IAlphaManipulation>("alphaGridManipulate", {
    adjust: true,
    rotate: true,
    invert: true,
    grayscale: true
  });

  const [color, setColor] = useLocalStorage("leftWidget", CM("hsla(180, 50%, 50%, 0.5)"));
  const [incrementColor, setIncrementColor] = useLocalStorage("rightWidget", CM("hsla(72, 15%, 10%, 0.05)"));
  const [incrementArr, setIncrementArr] = useLocalStorage<boolean[]>("adjustDirection", new Array(4).fill(true));

  const [adjust, setAdjust] = useState(addColor(color, incrementColor, incrementArr));

  const colorDebounce = useDebounce(color, 100);
  const incrementColorDebounce = useDebounce(incrementColor, 100);

  useEffect(() => {
    setAdjust(addColor(color, incrementColor, incrementArr));
  }, [color, incrementColor, alpha.invert, incrementArr]);

  const IncrementOrDecrement = ({ channel }: { channel: number }): JSX.Element => {
    const newArr = [...incrementArr];
    newArr.splice(channel, 1, !incrementArr[channel]);

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
          Input (1)
        </Label>
      </ColorSelectorWidget>

      <FlexColumn
        $cols={isMobile || isTablet ? 24 : isLaptop ? 20 : isComputer ? 16 : isWideScreen ? 14 : 11}
        $gap="20px"
        $order={isComputer || isWideScreen ? 1 : 0}
      >
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
            setAlpha={setAlpha as TSetState<Partial<IAlphaManipulation>>}
          />
        ))}

        <CodeModal code={ManipulationSample(colorDebounce, incrementColorDebounce, incrementArr, alpha)} />
      </FlexColumn>

      <ColorSelectorWidget
        color={incrementColor}
        setColor={setIncrementColor}
        initPicker="slider"
        initColorspace="hsl"
        adjustors={[0, 1, 2, 3].map((_, i) => (
          <IncrementOrDecrement key={"increment-decrement-" + i} channel={i} />
        ))}
      >
        <Label $where="right" $bgColor="hsla(0, 0%, 90%, 1)" $color="black">
          Adjustor
        </Label>
      </ColorSelectorWidget>
    </FadeIn>
  );
}
