import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import CodeModal from "../components/CodeModal";
import ColorIndicator from "../components/ColorIndicator";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import Spacers from "../components/Spacers";
import useBreakpointMap from "../hooks/useBreakpointMap";
import useDebounce from "../hooks/useDebounce";
import useQuery from "../hooks/useQuery";
import { Swatch, SwatchCounter } from "../styles/Swatch";
import addColor from "../utils/addColor";
import { ManipulationSample } from "../utils/codeSamples";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { Tooltip } from "../styles/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Heading } from "../styles/Heading";
import styled from "styled-components";
import { Ihsla } from "colormaster/types";
import { Label } from "../styles/Label";
import FullSlider from "../components/Sliders/FullSlider";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";

extendPlugins([A11yPlugin]);

const INFORMATIVE_TEXT = {
  adjust:
    "Color picker & each of the above sliders!\n Combines both color picker (input) and slider (delta)\n colors according to dropdown selection.",
  rotate:
    "Color picker & hue slider from above sliders only!\n Rotation is simply moving at a fixed radius\n (arc) along the color wheel.",
  invert:
    'Based on "Adjust". Similar to complementary harmony.\n Rotates 180° and flips the lightness value.\n Alpha channel included based on selection.',
  grayscale:
    'Based on "Adjust". Output will vary slightly in most cases.\n Large variance if lightness is changed.\n Centered on 2D color wheel for all lightness values.'
};

interface IAlphaManipulation {
  adjust: boolean;
  rotate: boolean;
  invert: boolean;
  grayscale: boolean;
}

interface IGridSwatch {
  state: ColorMaster;
  alpha: boolean;
  count: number;
}

interface IGridRowDetails {
  type: keyof IAlphaManipulation;
  state: ColorMaster;
}

interface IGridRow {
  arr: IGridRowDetails[];
  startCount: number;
}

const LabelledSwatch = styled(Swatch)`
  position: relative;
`;

const AdjustIcon = styled(FontAwesomeIcon).attrs((props: { $active: boolean }) => props)`
  color: ${(props) => (props.$active ? "black" : "hsla(0, 0%, 85%, 1)")};
  cursor: pointer;
`;

export default function Manipulate(): JSX.Element {
  const history = useHistory();
  const query = useQuery();
  const { isMobile, isTablet, isLaptop, isComputer } = useBreakpointMap();

  const [alpha, setAlpha] = useState<IAlphaManipulation>(() => {
    if (query.alpha) {
      const alphaArr = JSON.parse(query.alpha);
      return { adjust: alphaArr[0], rotate: alphaArr[1], invert: alphaArr[2], grayscale: alphaArr[3] };
    } else {
      return { adjust: true, rotate: true, invert: true, grayscale: true };
    }
  });

  const [color, setColor] = useState(CM(query.color ?? "hsla(180, 50%, 50%, 0.5)"));
  const [incrementColor, setIncrementColor] = useState(
    CM(
      `hsla(${query.hueBy ?? 72}, ${query.satBy ?? 15}%, ${query.lightBy ?? 10}%, ${
        query.alphaBy ? +query.alphaBy / 100 : 0.05
      })`
    )
  );
  const [incrementArr, setIncrementArr] = useState<boolean[]>([true, true, true, true]);
  const [adjust, setAdjust] = useState(addColor(color, incrementColor, incrementArr));

  const colorDebounce = useDebounce(color, 100);
  const incrementColorDebounce = useDebounce(incrementColor, 100);

  useEffect(() => {
    setAdjust(addColor(color, incrementColor, incrementArr));
  }, [color, incrementColor, alpha.invert, incrementArr]);

  useEffect(() => {
    const { h, s, l, a } = incrementColorDebounce.hsla();
    const color = colorDebounce.stringHEX().slice(1).toLowerCase();
    history.replace({
      pathname: "/manipulate",
      search: `?color=${color}&hueBy=${h.toFixed(2)}&satBy=${s.toFixed(2)}&lightBy=${l.toFixed(2)}&alphaBy=${(
        a * 100
      ).toFixed(2)}&adjustSettings=[${incrementArr.join(",")}]&alpha=[${Object.values(alpha).join(",")}]`
    });
  }, [history, colorDebounce, incrementColorDebounce, incrementArr, alpha]);

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

  const Title = ({ title, text }: { title: string; text: string }) => {
    return (
      <FlexRow>
        <Heading $size="h1">{title[0].toUpperCase() + title.slice(1)}</Heading>
        <Spacers width="4px" />
        <Tooltip $top={text.split("\n").length * -25 - 10}>
          <span>{text}</span>
          <FontAwesomeIcon icon={faInfoCircle} color="hsla(180, 100%, 40%, 1)" size="1x" />
        </Tooltip>
      </FlexRow>
    );
  };

  const GridSwatch = ({ state, alpha, count }: IGridSwatch) => {
    return (
      <LabelledSwatch
        title={state.stringHSL({ precision: [0, 0, 0, 2], alpha })}
        background={state.stringHSL()}
        onClick={() => setColor(state)}
        $radius={75}
        $borderRadius="4px"
        $cursor="pointer"
      >
        <SwatchCounter $isLight={state.isLight()}>{count}</SwatchCounter>
      </LabelledSwatch>
    );
  };

  const GridRow = ({ arr, startCount }: IGridRow) => {
    return (
      <FlexRow $wrap="wrap" $gap="12px">
        {arr.map((item, i) => (
          <FlexColumn key={item.type} $gap="8px" $cols={isMobile ? 24 : 11}>
            <Title title={item.type} text={INFORMATIVE_TEXT[item.type]} />

            <ColorIndicator
              color={item.state.stringHSL({ precision: [0, 0, 0, 2], alpha: alpha[item.type] })}
              alpha={alpha[item.type]}
              setAlpha={(arg) => setAlpha({ ...alpha, [item.type]: arg })}
              dir="column"
            />

            <GridSwatch state={item.state} alpha={alpha[item.type]} count={i + startCount} />
          </FlexColumn>
        ))}
      </FlexRow>
    );
  };

  const IncrementOrDecrement = ({ channel }: { channel: number }): JSX.Element => {
    const newArr = [...incrementArr];
    newArr.splice(channel, 0, !incrementArr[channel]);

    return (
      <FlexColumn $cols={1}>
        <AdjustIcon icon={faPlus} $active={incrementArr[channel]} onClick={() => setIncrementArr(newArr)} />
        <AdjustIcon icon={faMinus} $active={!incrementArr[channel]} onClick={() => setIncrementArr(newArr)} />
      </FlexColumn>
    );
  };

  return (
    <FlexRow $wrap="wrap" $gap={isMobile || isTablet ? "32px" : "28px"}>
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
              { type: "adjust", state: adjust },
              { type: "rotate", state: CM({ ...color.hsla(), h: adjust.hue }) }
            ],
            [
              { type: "invert", state: CM(adjust.hsla()).invert({ alpha: alpha.invert }) },
              { type: "grayscale", state: CM(adjust.hsla()).grayscale() }
            ]
          ] as IGridRowDetails[][]
        ).map((arr, i) => (
          <GridRow key={arr[0].type + arr[1].type} arr={arr} startCount={(i + 1) * 2} />
        ))}

        <CodeModal code={ManipulationSample(colorDebounce, incrementColorDebounce, incrementArr, alpha)} />
      </FlexColumn>
    </FlexRow>
  );
}
