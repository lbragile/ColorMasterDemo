import React, { useContext, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { A11yStatisticsSample } from "../utils/codeSamples";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import CodeModal from "../components/CodeModal";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { Heading } from "../styles/Heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFire, faMoon, faSnowflake, faSun, faTimes } from "@fortawesome/free-solid-svg-icons";
import Spacers from "../components/Spacers";
import { BreakpointsContext } from "../components/App";
import { FadeIn } from "../styles/Fade";
import useLocalStorage from "../hooks/useLocalStorage";
import { IAlphaStatistics, IGridRowDetails } from "../types/grid";
import GridRow from "../components/GridRow";
import { TSetState } from "../types/react";

extendPlugins([A11yPlugin]);

interface IPureHue {
  pure: boolean;
  reason: string;
}

export default function Statistics(): JSX.Element {
  const { isMobile, isTablet, isLaptop, isComputer, isWideScreen } = useContext(BreakpointsContext);

  const [color, setColor] = useLocalStorage("leftWidget", CM("hsla(45, 75%, 50%, 1)"));
  const [alpha, setAlpha] = useLocalStorage<IAlphaStatistics<boolean>>("alphaGridStatistics", {
    cool: true,
    warm: true,
    pure: true,
    web: true
  });

  const [pureHue, setPureHue] = useState<IPureHue>(color.isPureHue() as IPureHue);
  const [closest, setClosest] = useState<IAlphaStatistics<ColorMaster>>({
    warm: CM(color.hsla()).closestWarm(),
    cool: CM(color.hsla()).closestCool(),
    pure: CM(color.hsla()).closestPureHue(),
    web: CM(color.hsla()).closestWebSafe()
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

  return (
    <FadeIn $wrap="wrap" $gap={isMobile || isTablet || isLaptop || isComputer ? "32px" : "28px"}>
      <ColorSelectorWidget
        color={color}
        setColor={setColor}
        initPicker="wheel"
        initColorspace="hsl"
        harmony={[closest.warm, closest.cool, closest.pure, closest.web]}
      />

      <FlexColumn
        $cols={isMobile || isTablet ? 24 : isLaptop ? 11 : isComputer ? 10 : isWideScreen ? 4 : 6}
        $gap="32px"
      >
        <FlexColumn $gap="8px">
          <Heading $size="h1">Brightness</Heading>
          <Heading $size="h2">{color.brightness()}</Heading>
        </FlexColumn>

        <FlexColumn $gap="8px">
          <Heading $size="h1">Luminance</Heading>
          <Heading $size="h2">{color.luminance()}</Heading>
        </FlexColumn>

        <FlexColumn $gap="8px">
          <Heading $size="h1">Light | Dark</Heading>
          <FlexRow $gap="8px">
            <Heading $size="h2">{color.isLight() ? "Light" : "Dark"}</Heading>
            <h2>
              {color.isLight() ? (
                <FontAwesomeIcon icon={faSun} color="hsla(30, 100%, 50%, 1)" />
              ) : (
                <FontAwesomeIcon icon={faMoon} color="hsla(60, 100%, 25%, 1)" />
              )}
            </h2>
          </FlexRow>
        </FlexColumn>

        <FlexColumn $gap="8px">
          <Heading $size="h1">Warm | Cool</Heading>
          <FlexRow $gap="8px">
            <Heading $size="h2">{color.isWarm() ? "Warm" : "Cool"}</Heading>
            <h2>
              {color.isWarm() ? (
                <FontAwesomeIcon icon={faFire} color="hsla(0, 100%, 40%, 1)" />
              ) : (
                <FontAwesomeIcon icon={faSnowflake} color="hsla(210, 100%, 40%, 1)" />
              )}
            </h2>
          </FlexRow>
        </FlexColumn>

        <FlexColumn $gap="8px">
          <Heading $size="h1">Pure Hue?</Heading>
          <Heading $size="h2">
            {pureHue.pure ? (
              <FontAwesomeIcon icon={faCheck} color="hsla(120, 100%, 40%, 1)" />
            ) : (
              <span>
                {pureHue.reason[0].toUpperCase() + pureHue.reason.slice(1)}
                <Spacers width="4px" />
                <FontAwesomeIcon icon={faTimes} color="hsla(0, 100%, 40%, 1)" />
              </span>
            )}
          </Heading>
        </FlexColumn>
      </FlexColumn>

      <FlexColumn $cols={isMobile || isTablet ? 24 : isLaptop ? 20 : isComputer ? 16 : 11} $gap="24px">
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
          <GridRow
            key={arr[0].type + arr[1].type}
            arr={arr}
            startCount={i * 2 + 1}
            page="statistics"
            setColor={setColor}
            alpha={alpha}
            setAlpha={setAlpha as TSetState<Partial<IAlphaStatistics>>}
          />
        ))}

        <CodeModal code={A11yStatisticsSample(colorDebounce, alpha)} />
      </FlexColumn>
    </FadeIn>
  );
}
