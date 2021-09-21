import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import CM, { ColorMaster } from "colormaster";
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
import { faCaretDown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Heading } from "../styles/Heading";
import styled from "styled-components";
import Dropdown from "../components/Dropdown";
import RangeInput from "../components/Sliders/RangeInput";
import NumberInput from "../components/Sliders/NumberInput";
import { Ihsla } from "colormaster/types";
import { Label } from "../styles/Label";

const INFORMATIVE_TEXT = {
  adjust:
    "Color picker & each of the above sliders!\n Combines both color picker (input) and slider (delta)\n colors according to dropdown selection.",
  rotate:
    "Color picker & hue slider from above sliders only!\n Rotation is simply moving at a fixed radius\n (arc) along the color wheel.",
  invert:
    "Color picker only! Similar to complementary harmony.\n Rotates 180° and flips the lightness value.\n Alpha channel included based on selection.",
  grayscale:
    "Color picker only! Output will vary slightly in most cases.\n Large variance if lightness is changed.\n Centered on 2D color wheel for all lightness values."
};

const ColorAdjustmentOpts = ["Add", "Sub"];

interface IAlphaManipulation {
  adjust: boolean;
  rotate: boolean;
  invert: boolean;
  grayscale: boolean;
}

interface IGridSwatch {
  state: ColorMaster;
  setState: React.Dispatch<React.SetStateAction<ColorMaster>>;
  alpha: boolean;
  count: number;
}

interface IGridRowDetails {
  type: keyof IAlphaManipulation;
  state: ColorMaster;
}

interface IGridRow {
  arr: IGridRowDetails[];
  alpha: IAlphaManipulation;
  setAlpha: React.Dispatch<React.SetStateAction<IAlphaManipulation>>;
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  startCount: number;
}

const HorizontalLine = styled.hr`
  width: 75%;
`;

const LabelledSwatch = styled(Swatch)`
  position: relative;
`;

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

const GridSwatch = ({ state, setState, alpha, count }: IGridSwatch) => {
  return (
    <LabelledSwatch
      title={state.stringHSL({ precision: [2, 2, 2, 2], alpha })}
      background={state.stringHSL()}
      onClick={() => setState(state)}
      $radius={75}
      $borderRadius="4px"
      $cursor="pointer"
    >
      <SwatchCounter>{count}</SwatchCounter>
    </LabelledSwatch>
  );
};

const GridRow = ({ arr, alpha, setAlpha, setColor, startCount }: IGridRow) => {
  return (
    <FlexRow>
      {arr.map((item, i) => (
        <FlexColumn key={item.type} $gap="8px" $cols={10}>
          <Title title={item.type} text={INFORMATIVE_TEXT[item.type]} />

          <ColorIndicator
            color={item.state.stringHSL({ precision: [0, 0, 0, 2], alpha: alpha[item.type] })}
            alpha={alpha[item.type]}
            setAlpha={(arg) => setAlpha({ ...alpha, [item.type]: arg })}
          />

          <GridSwatch state={item.state} setState={setColor} alpha={alpha[item.type]} count={i + startCount} />
        </FlexColumn>
      ))}
    </FlexRow>
  );
};

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
  const [dropdownValues, setDropdownValues] = useState<("Add" | "Sub")[]>(["Add", "Add", "Add", "Add"]);
  const [invert, setInvert] = useState(CM(color.hsla()).invert({ alpha: alpha.invert }));
  const [grayscale, setGrayscale] = useState(CM(color.rgba()).grayscale());
  const [rotate, setRotate] = useState(
    CM(color.hsla()).rotate((dropdownValues[0] === "Add" ? 1 : -1) * incrementColor.hue)
  );

  const [adjust, setAdjust] = useState(addColor(color, incrementColor, dropdownValues));

  const colorDebounce = useDebounce(color, 100);
  const incrementColorDebounce = useDebounce(incrementColor, 100);

  useEffect(() => {
    setInvert(CM(color.hsla()).invert({ alpha: alpha.invert }));
    setGrayscale(CM(color.rgba()).grayscale());
    setRotate(CM(color.hsla()).rotate((dropdownValues[0] === "Add" ? 1 : -1) * incrementColor.hue));
    setAdjust(addColor(color, incrementColor, dropdownValues));
  }, [color, incrementColor, alpha.invert, dropdownValues]);

  useEffect(() => {
    const { h, s, l, a } = incrementColorDebounce.hsla();
    const color = colorDebounce.stringHEX().slice(1).toLowerCase();
    history.replace({
      pathname: "/manipulate",
      search: `?color=${color}&hueBy=${h.toFixed(2)}&satBy=${s.toFixed(2)}&lightBy=${l.toFixed(2)}&alphaBy=${(
        a * 100
      ).toFixed(2)}&adjustSettings=[${Object.values(dropdownValues).join(",")}]&alpha=[${Object.values(alpha).join(
        ","
      )}]`
    });
  }, [history, colorDebounce, incrementColorDebounce, dropdownValues, alpha]);

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

  return (
    <FlexRow $wrap="wrap" $gap="12px">
      <FlexColumn $cols={isMobile ? 24 : isTablet || isLaptop ? 12 : isComputer ? 8 : 6}>
        <ColorSelectorWidget
          color={color}
          setColor={setColor}
          initPicker="wheel"
          initColorspace="hsl"
          harmony={[color, adjust, rotate, invert, grayscale]}
        >
          <Label $where="left" $bgColor="hsla(0, 0%, 90%, 1)" $color="black">
            1
          </Label>
        </ColorSelectorWidget>
      </FlexColumn>

      <Spacers width="12px" />

      <FlexColumn $cols={5} $gap="12px">
        <FlexRow>
          <RangeInput
            color={`hsla(${incrementColor.hue}, 100%, 50%, 1)`}
            min="0"
            max="360"
            value={incrementColor.hue}
            onChange={handleChange("h")}
          />

          <Spacers width="6px" />

          <NumberInput
            min="0"
            max="360"
            value={incrementColor.hue}
            onChange={handleChange("h")}
            format="hsl"
            postfix="°"
          />

          <Spacers width="6px" />

          <Dropdown
            opts={ColorAdjustmentOpts}
            value={dropdownValues[0]}
            setValue={(arg) => setDropdownValues([arg as "Add" | "Sub", ...dropdownValues.slice(1)])}
            icon={<FontAwesomeIcon icon={faCaretDown} color="gray" />}
            iconPos="right"
            switcherPos="right"
            cols={6}
          />
        </FlexRow>
        <FlexRow>
          <RangeInput
            color={`hsla(${incrementColor.hue}, ${incrementColor.saturation}%, 50%, 1)`}
            min="0"
            max="100"
            value={incrementColor.saturation}
            onChange={handleChange("s")}
          />

          <Spacers width="6px" />

          <NumberInput
            min="0"
            max="100"
            value={incrementColor.saturation}
            onChange={handleChange("s")}
            postfix="%"
            format="hsl"
          />

          <Spacers width="6px" />

          <Dropdown
            opts={ColorAdjustmentOpts}
            value={dropdownValues[1]}
            setValue={(arg) => setDropdownValues([dropdownValues[0], arg as "Add" | "Sub", ...dropdownValues.slice(2)])}
            icon={<FontAwesomeIcon icon={faCaretDown} color="gray" />}
            iconPos="right"
            switcherPos="right"
            cols={6}
          />
        </FlexRow>
        <FlexRow>
          <RangeInput
            color={`hsla(0, 0%, ${incrementColor.lightness - 5}%, 1)`}
            min="0"
            max="100"
            value={incrementColor.lightness}
            onChange={handleChange("l")}
          />

          <Spacers width="6px" />

          <NumberInput
            min="0"
            max="100"
            value={incrementColor.lightness}
            onChange={handleChange("l")}
            postfix="%"
            format="hsl"
          />

          <Spacers width="6px" />

          <Dropdown
            opts={ColorAdjustmentOpts}
            value={dropdownValues[2]}
            setValue={(arg) =>
              setDropdownValues([...dropdownValues.slice(0, 2), arg as "Add" | "Sub", dropdownValues[3]])
            }
            icon={<FontAwesomeIcon icon={faCaretDown} color="gray" />}
            iconPos="right"
            switcherPos="right"
            cols={6}
          />
        </FlexRow>
        <FlexRow>
          <RangeInput
            color="rgba(0, 0, 0, 0.6)"
            min="0"
            max="100"
            value={incrementColor.alpha * 100}
            onChange={handleChange("a")}
          />

          <Spacers width="6px" />

          <NumberInput
            min="0"
            max="100"
            value={incrementColor.alpha * 100}
            onChange={handleChange("a")}
            format="hsl"
            postfix="%"
          />

          <Spacers width="6px" />

          <Dropdown
            opts={ColorAdjustmentOpts}
            value={dropdownValues[3]}
            setValue={(arg) => setDropdownValues([...dropdownValues.slice(0, 3), arg as "Add" | "Sub"])}
            icon={<FontAwesomeIcon icon={faCaretDown} color="gray" />}
            iconPos="right"
            switcherPos="right"
            cols={6}
          />
        </FlexRow>
      </FlexColumn>

      <FlexColumn $cols={12}>
        {(
          [
            [
              { type: "adjust", state: adjust },
              { type: "rotate", state: rotate }
            ],
            [
              { type: "invert", state: invert },
              { type: "grayscale", state: grayscale }
            ]
          ] as IGridRowDetails[][]
        ).map((arr, i) => (
          <>
            <GridRow
              key={arr[0].type + arr[1].type}
              arr={arr}
              alpha={alpha}
              setAlpha={setAlpha}
              setColor={setColor}
              startCount={(i + 1) * 2}
            />
            {i === 0 && (
              <>
                <Spacers height="20px" />
                <HorizontalLine />
                <Spacers height="12px" />
              </>
            )}
          </>
        ))}

        <Spacers height="32px" />

        <CodeModal code={ManipulationSample(colorDebounce, incrementColorDebounce, dropdownValues, alpha)} />
      </FlexColumn>
    </FlexRow>
  );
}
