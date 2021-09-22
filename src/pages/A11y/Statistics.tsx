import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";
import { Swatch, SwatchCounter } from "../../styles/Swatch";
import { A11yStatisticsSample } from "../../utils/codeSamples";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import CodeModal from "../../components/CodeModal";
import ColorIndicator from "../../components/ColorIndicator";
import ColorSelectorWidget from "../../components/ColorSelectorWidget";
import Spacers from "../../components/Spacers";
import { FlexColumn, FlexRow } from "../../styles/Flex";
import { Heading } from "../../styles/Heading";
import styled from "styled-components";
import useBreakpointMap from "../../hooks/useBreakpointMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFire, faMoon, faSnowflake, faSun, faTimes } from "@fortawesome/free-solid-svg-icons";

extendPlugins([A11yPlugin]);

interface IPureHue {
  pure: boolean;
  reason: string;
}

interface IGridSwatch {
  state: ColorMaster;
  alpha: boolean;
  count: number;
}

interface IGridRowDetails {
  type: "warm" | "cool" | "pure" | "web";
  text: string;
  state: ColorMaster;
}

interface IGridRow {
  arr: IGridRowDetails[];
  startCount: number;
}

interface IStatistics<T = boolean | ColorMaster> {
  warm: T;
  cool: T;
  pure: T;
  web: T;
}

const LabelledSwatch = styled(Swatch)`
  position: relative;
`;

export default function Statistics(): JSX.Element {
  const history = useHistory();
  const query = useQuery();
  const { isMobile, isTablet, isLaptop, isComputer } = useBreakpointMap();

  const [color, setColor] = useState(CM(query.color ?? "hsla(45, 75%, 50%, 1)"));
  const [pureHue, setPureHue] = useState<IPureHue>(color.isPureHue() as IPureHue);
  const [closest, setClosest] = useState<IStatistics<ColorMaster>>({
    warm: CM(color.hsla()).closestWarm(),
    cool: CM(color.hsla()).closestCool(),
    pure: CM(color.hsla()).closestPureHue(),
    web: CM(color.hsla()).closestWebSafe()
  });

  const [alpha, setAlpha] = useState<IStatistics<boolean>>(() => {
    if (query.alpha) {
      const alphaArr = JSON.parse(query.alpha);
      return { cool: alphaArr[0], warm: alphaArr[1], pure: alphaArr[2], web: alphaArr[3] };
    } else {
      return { cool: true, warm: true, pure: true, web: true };
    }
  });

  const colorDebounce = useDebounce(color, 100);

  useEffect(() => {
    setPureHue(color.isPureHue() as IPureHue);
    setClosest({
      warm: CM(color.hsla()).closestWarm(),
      cool: CM(color.hsla()).closestCool(),
      pure: CM(color.hsla()).closestPureHue(),
      web: CM(color.hsla()).closestWebSafe()
    });
  }, [color]);

  useEffect(() => {
    history.replace({
      pathname: "/accessibility/statistics",
      search: `?color=${colorDebounce.stringHEX().slice(1).toLowerCase()}&alpha=[${Object.values(alpha).join(",")}]`
    });
  }, [history, colorDebounce, alpha]);

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
            <Heading $size="h1">{item.text}</Heading>

            <ColorIndicator
              color={item.state.stringHSL({ precision: [0, 0, 0, 2], alpha: alpha[item.type] })}
              alpha={alpha[item.type]}
              setAlpha={(arg) => setAlpha({ ...alpha, [item.type]: arg })}
            />

            <GridSwatch state={item.state} alpha={alpha[item.type]} count={i + startCount} />
          </FlexColumn>
        ))}
      </FlexRow>
    );
  };

  return (
    <FlexRow>
      <ColorSelectorWidget
        color={color}
        setColor={setColor}
        initPicker="wheel"
        initColorspace="hsl"
        harmony={[closest.warm, closest.cool, closest.pure, closest.web]}
      />

      <Spacers width="24px" />

      <FlexColumn $cols={6} $gap="12px">
        <div>
          <Heading $size="h1">Brightness</Heading>
          <Heading $size="h2" $color="grey">
            {color.brightness()}
          </Heading>
        </div>

        <div>
          <Heading $size="h1">Luminance</Heading>
          <Heading $size="h2" $color="grey">
            {color.luminance()}
          </Heading>
        </div>

        <div>
          <Heading $size="h1">Light | Dark</Heading>
          <Heading $size="h2" $color="grey">
            <FlexRow $gap="8px">
              {color.isLight() ? "Light" : "Dark"}
              {color.isLight() ? (
                <FontAwesomeIcon icon={faSun} color="hsla(30, 100%, 50%, 1)" />
              ) : (
                <FontAwesomeIcon icon={faMoon} color="hsla(60, 100%, 25%, 1)" />
              )}
            </FlexRow>
          </Heading>
        </div>

        <div>
          <Heading $size="h1">Warm | Cool</Heading>
          <Heading $size="h2" $color="grey">
            <FlexRow $gap="8px">
              {color.isWarm() ? "Warm" : "Cool"}
              {color.isWarm() ? (
                <FontAwesomeIcon icon={faFire} color="red" />
              ) : (
                <FontAwesomeIcon icon={faSnowflake} color="blue" />
              )}
            </FlexRow>
          </Heading>
        </div>

        <div>
          <Heading $size="h1">Tinted | Shaded | Toned</Heading>
          <Heading $size="h2" $color="grey">
            {pureHue.reason !== "N/A" ? pureHue.reason[0].toUpperCase() + pureHue.reason.slice(1) : "N/A"}
          </Heading>
        </div>

        <div>
          <Heading $size="h1">Pure Hue?</Heading>
          <Heading $size="h2" $color="grey">
            {pureHue.pure ? (
              <FontAwesomeIcon icon={faCheck} color="hsla(120, 100%, 40%, 1)" />
            ) : (
              <FontAwesomeIcon icon={faTimes} color="hsla(0, 100%, 40%, 1)" />
            )}
          </Heading>
        </div>
      </FlexColumn>

      <FlexColumn $cols={isMobile ? 24 : isTablet || isLaptop ? 12 : isComputer ? 24 : 12} $gap="24px">
        {(
          [
            [
              { type: "warm", text: "Closest Warm", state: closest.warm },
              { type: "cool", text: "Closest Cool", state: closest.cool }
            ],
            [
              { type: "pure", text: "Closest Pure Hue", state: closest.pure },
              { type: "web", text: "Closest Web Safe", state: closest.web }
            ]
          ] as IGridRowDetails[][]
        ).map((arr, i) => (
          <GridRow key={arr[0].type + arr[1].type} arr={arr} startCount={i * 2 + 1} />
        ))}

        <CodeModal code={A11yStatisticsSample(colorDebounce, alpha)} />
      </FlexColumn>
    </FlexRow>
  );
}
