import React, { useEffect, useState } from "react";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import HarmonyPlugin from "colormaster/plugins/harmony";
import { THarmony, TMonoEffect } from "colormaster/types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CodeModal from "../components/CodeModal";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import Spacers from "../components/Spacers";
import useBreakpointMap from "../hooks/useBreakpointMap";
import useDebounce from "../hooks/useDebounce";
import useQuery from "../hooks/useQuery";
import { Swatch, SwatchCounter, CurrentColorIcon } from "../styles/Swatch";
import { HarmonySample } from "../utils/codeSamples";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import RangeInput from "../components/Sliders/RangeInput";

extendPlugins([HarmonyPlugin, A11yPlugin]);

const typeOptions = [
  "analogous",
  "complementary",
  "split-complementary",
  "double-split-complementary",
  "triad",
  "rectangle",
  "square",
  "monochromatic"
].map((value) => ({ key: value, text: value.includes("double") ? "double split-complementary" : value, value }));

const effectOptions = ["shades", "tints", "tones"].map((value) => ({ key: value, text: value, value }));

const VerticalMenu = styled.div`
  border: 1px solid hsla(0, 0%, 90%, 1);
  border-radius: 8px;
  background: white;
  overflow: hidden;
  position: relative;
`;

const MenuItem = styled.div.attrs((props: { $active: boolean; $last: boolean }) => props)`
  padding: 16px;
  font-size: 1.2rem;
  border-bottom: ${(props) => (props.$last ? "none" : "1px solid hsla(0, 0%, 95%, 1)")};
  text-transform: capitalize;
  cursor: pointer;
  background: ${(props) => (props.$active ? "hsla(0, 0%, 90%, 1)" : "transparent")};
  font-weight: ${(props) => (props.$active ? "bolder" : "normal")};

  &:hover {
    background: ${(props) => (props.$active ? "hsla(0, 0%, 90%, 1)" : "hsla(0, 0%, 95%, 1)")};
  }
`;

const MonoItem = styled.div.attrs((props: { $active: boolean }) => props)`
  padding: 8px;
  text-transform: capitalize;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    font-weight: bolder;
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
  const history = useHistory();
  const query = useQuery();
  const { isMobile, isTablet, isLaptop, isComputer } = useBreakpointMap();

  const [color, setColor] = useState(CM(query.color ?? "hsla(0, 75%, 50%, 1)"));
  const [harmony, setHarmony] = useState(color.harmony().map((c) => c.stringHSL({ precision: [2, 2, 2, 2] })));
  const [type, setType] = useState<THarmony>(
    (typeOptions.find((item) => item.value === query.type)?.value as THarmony) ?? "analogous"
  );
  const [effect, setEffect] = useState<TMonoEffect>(
    (effectOptions.find((item) => item.value === query.effect)?.value as TMonoEffect) ?? "shades"
  );
  const [amount, setAmount] = useState(Number(query.amount ?? 7));

  const colorDebounce = useDebounce(color, 100);

  useEffect(() => {
    setHarmony(
      colorDebounce
        .harmony({ type, effect, amount })
        .map((c) => c.stringHSL({ precision: [2, 2, 2, 2] }))
        .filter((val, i, arr) => arr.indexOf(val) === i) // filter duplicates in case of picker overlap
    );
  }, [colorDebounce, type, effect, amount]);

  useEffect(() => {
    const baseSearch = `?color=${colorDebounce.stringHEX().slice(1).toLowerCase()}&type=${type}`;

    history.replace({
      pathname: "/harmony",
      search: type !== "monochromatic" ? baseSearch : `${baseSearch}&effect=${effect}&amount=${amount}`
    });
  }, [history, colorDebounce, type, effect, amount]);

  return (
    <FlexRow $wrap="wrap" $gap="28px">
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
          {typeOptions.map((t) => {
            return (
              <MenuItem
                key={t.text + "-menu-item"}
                $active={type === t.value}
                $last={t.value === "monochromatic"}
                onClick={() => setType(t.value as THarmony)}
              >
                {t.text}{" "}
                {t.text === "monochromatic" && type !== t.value && (
                  <MonoLabelIndicator>
                    <FontAwesomeIcon icon={faChevronCircleDown} color="white" />
                    <Spacers width="2px" />
                    {effectOptions.length}
                  </MonoLabelIndicator>
                )}
                {type === "monochromatic" && t.text === "monochromatic" && (
                  <>
                    <Spacers height="4px" />
                    <div>
                      {effectOptions.map((e) => {
                        return (
                          <MonoItem
                            key={e.text + "-monochromatic-effect"}
                            $active={e.text === effect}
                            onClick={() => {
                              setEffect(e.text as TMonoEffect);
                              setType("monochromatic");
                            }}
                          >
                            <MonoEffectList>{e.text}</MonoEffectList>
                          </MonoItem>
                        );
                      })}

                      <Spacers height="16px" />

                      <div>
                        <AmountLabel>Amount</AmountLabel>
                        <Spacers height="12px" />

                        <RangeInput
                          color="hsl(180,100%,40%)"
                          min="2"
                          max="10"
                          value={amount}
                          width="100%"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(+e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </MenuItem>
            );
          })}
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
    </FlexRow>
  );
}
