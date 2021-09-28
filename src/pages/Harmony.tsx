import React, { useContext, useEffect, useState } from "react";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import HarmonyPlugin from "colormaster/plugins/harmony";
import { THarmony, TMonoEffect } from "colormaster/types";
import styled from "styled-components";
import CodeModal from "../components/CodeModal";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import Spacers from "../components/Spacers";
import useDebounce from "../hooks/useDebounce";
import { Swatch, SwatchCounter, CurrentColorIcon } from "../styles/Swatch";
import { HarmonySample } from "../utils/codeSamples";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import RangeInput from "../components/Sliders/RangeInput";
import { BreakpointsContext } from "../components/App";
import { FadeIn } from "../styles/Fade";
import { HarmonyIcons } from "../utils/harmonyIcons";
import useLocalStorage from "../hooks/useLocalStorage";

extendPlugins([HarmonyPlugin, A11yPlugin]);

const typeOptions: THarmony[] = [
  "analogous",
  "complementary",
  "split-complementary",
  "double-split-complementary",
  "triad",
  "rectangle",
  "square",
  "monochromatic"
];

const effectOptions: TMonoEffect[] = ["shades", "tints", "tones"];

const VerticalMenu = styled.div`
  border: 1px solid ${(props) => props.theme.colors.borderLight};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.bgDefault};
  overflow: hidden;
  position: relative;
`;

const MenuItem = styled.div.attrs((props: { $active: boolean; $last: boolean }) => props)`
  padding: 4px 16px 0 4px;
  border-bottom: ${(props) => (props.$last ? "none" : `1px solid ${props.theme.colors.borderLight}`)};
  text-transform: capitalize;
  cursor: pointer;
  background: ${(props) => (props.$active ? props.theme.colors.bgActive : "transparent")};
  font-weight: ${(props) => (props.$active ? "bolder" : "normal")};

  &:hover {
    background: ${(props) => (props.$active ? props.theme.colors.bgActive : props.theme.colors.bgHover)};
  }
`;

const MonoItem = styled.div.attrs((props: { $active: boolean }) => props)`
  padding: 8px;
  text-transform: capitalize;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    font-weight: bold;
  }
`;

const MonoLabelIndicator = styled.div`
  background-color: hsla(180, 100%, 40%);
  color: white;
  font-weight: bold;
  padding: 4px;
  border-radius: 4px;
  width: fit-content;
  display: inline-block;
  position: absolute;
  right: 12px;
  bottom: 12px;
`;

const MonoEffectList = styled.li`
  list-style: none;
  &:before {
    content: "▸";
    margin-right: 4px;
  }
`;

const LeftAlignedFlexColumn = styled(FlexColumn)`
  align-items: start;
  padding: 0 10px;
`;

const LeftAlignedFlexRow = styled(FlexRow)`
  justify-content: start;
`;

const AmountLabel = styled.div`
  padding: 4px 8px;
  background-color: hsla(180, 100%, 40%, 1);
  width: fit-content;
  border-radius: 4px 0 4px 0;
  color: white;
`;

const SwatchContainer = styled.div`
  position: relative;
`;

export default function Harmony(): JSX.Element {
  const { isMobile, isTablet, isLaptop, isComputer } = useContext(BreakpointsContext);

  const [color, setColor] = useLocalStorage("leftWidget", CM("hsla(0, 75%, 50%, 1)"));
  const [type, setType] = useLocalStorage<THarmony>("harmonyType", "analogous");
  const [effect, setEffect] = useLocalStorage<TMonoEffect>("monochromaticEffect", "shades");
  const [amount, setAmount] = useLocalStorage("monochromaticAmount", 7);

  const [harmony, setHarmony] = useState(color.harmony().map((c) => c.stringHSL({ precision: [2, 2, 2, 2] })));

  const colorDebounce = useDebounce(color, 100);

  useEffect(() => {
    setHarmony(
      colorDebounce
        .harmony({ type, effect, amount })
        .map((c) => c.stringHSL({ precision: [2, 2, 2, 2] }))
        .filter((val, i, arr) => arr.indexOf(val) === i) // filter duplicates in case of picker overlap
    );
  }, [colorDebounce, type, effect, amount]);

  return (
    <FadeIn $wrap="wrap" $gap="28px">
      <ColorSelectorWidget
        color={color}
        setColor={setColor}
        initPicker="wheel"
        initColorspace="hsl"
        harmony={
          // only show harmonies if not shades or tints
          type !== "monochromatic" || (type === "monochromatic" && effect === "tones")
            ? color.harmony({ type, effect, amount })
            : undefined
        }
      />

      <FlexColumn $cols={isMobile ? 24 : isTablet || isLaptop ? 8 : isComputer ? 12 : 6}>
        <VerticalMenu>
          {typeOptions.map((t) => (
            <MenuItem
              key={t + "-menu-item"}
              $active={type === t}
              $last={t === "monochromatic"}
              onClick={() => setType(t)}
            >
              <LeftAlignedFlexRow>
                {HarmonyIcons[t]} {t.includes("double") ? "Double Split-Complementary" : t}
              </LeftAlignedFlexRow>
              {t === "monochromatic" && t !== type && (
                <MonoLabelIndicator>
                  <FontAwesomeIcon icon={faChevronCircleDown} color="white" />
                  <Spacers width="2px" />
                  {effectOptions.length}
                </MonoLabelIndicator>
              )}
              {t === "monochromatic" && t === type && (
                <>
                  <LeftAlignedFlexColumn $gap="4px">
                    {effectOptions.map((e) => (
                      <MonoItem
                        key={e + "-monochromatic-effect"}
                        $active={e === effect}
                        onClick={() => {
                          setEffect(e);
                          setType("monochromatic");
                        }}
                      >
                        <MonoEffectList>{e}</MonoEffectList>
                      </MonoItem>
                    ))}

                    <Spacers height="8px" />

                    <AmountLabel>Amount</AmountLabel>

                    <Spacers height="8px" />

                    <RangeInput
                      color="hsl(180,100%,40%)"
                      min="2"
                      max="10"
                      value={amount}
                      width="100%"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(+e.target.value)}
                    />
                  </LeftAlignedFlexColumn>
                  <Spacers height="16px" />
                </>
              )}
            </MenuItem>
          ))}
        </VerticalMenu>

        <Spacers height={isMobile || isTablet ? "8px" : "32px"} />

        <CodeModal code={HarmonySample(color, type, effect, amount)} />
      </FlexColumn>

      <FlexColumn $cols={isMobile || isTablet ? 24 : isLaptop ? 21 : isComputer ? 18 : 8}>
        <FlexRow $gap="8px" $wrap="wrap">
          {harmony.map((swatch, i) => (
            <SwatchContainer key={swatch + "_" + i}>
              <Swatch
                title={swatch}
                $radius={harmony.length > 5 ? 60 : harmony.length > 4 ? 70 : 65}
                $borderRadius="4px"
                background={swatch}
                onClick={() => setColor(CM(swatch))}
                $cursor="pointer"
              />
              {swatch !== "transparent" && (
                <SwatchCounter $top="1px" $left="1px">
                  {i + 1}
                </SwatchCounter>
              )}
              {CM(swatch).stringHSL({ precision: [2, 2, 2, 2] }) === color.stringHSL({ precision: [2, 2, 2, 2] }) && (
                <CurrentColorIcon icon={faCheckCircle} color={color.isDark() ? "white" : "black"} size="2x" />
              )}
            </SwatchContainer>
          ))}
        </FlexRow>
      </FlexColumn>
    </FadeIn>
  );
}
