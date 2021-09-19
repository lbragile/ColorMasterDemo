import React, { useEffect, useState } from "react";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import HarmonyPlugin from "colormaster/plugins/harmony";
import { THarmony, TMonoEffect } from "colormaster/types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CodeModal from "../components/CodeModal";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import FullSlider from "../components/Sliders/FullSlider";
import Spacers from "../components/Spacers";
import useBreakpointMap from "../hooks/useBreakpointMap";
import useDebounce from "../hooks/useDebounce";
import useQuery from "../hooks/useQuery";
import { Swatch, SwatchCounter, CurrentColorIcon } from "../styles/Swatch";
import { HarmonySample } from "../utils/codeSamples";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

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

const VerticalMenu = styled.div``;

const SwatchContainer = styled.div`
  position: relative;
`;

const MonoEffectList = styled.li`
  list-style: none;
  &:before {
    content: "•";
    margin-right: 4px;
    font-size: smaller;
  }
`;

export default function Harmony(): JSX.Element {
  const history = useHistory();
  const query = useQuery();
  const { isComputer, isWideScreen } = useBreakpointMap();

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
    <FlexRow>
      <FlexColumn $cols={10}>
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
      </FlexColumn>

      <FlexColumn $cols={3}>
        <VerticalMenu>
          {typeOptions.map((t) => {
            return (
              <div
                key={t.text + "-menu-item"}
                // active={type === t.value}
                onClick={() => setType(t.value as THarmony)}
              >
                {t.text}{" "}
                {t.text === "monochromatic" && type !== t.value && (
                  <div>
                    <FontAwesomeIcon icon={faChevronCircleDown} />
                    {effectOptions.length}
                  </div>
                )}
                {type === "monochromatic" && t.text === "monochromatic" && (
                  <VerticalMenu>
                    {effectOptions.map((e) => {
                      return (
                        <div
                          key={e.text + "-monochromatic-effect"}
                          // active={e.text === effect}
                          onClick={() => {
                            setEffect(e.text as TMonoEffect);
                            setType("monochromatic");
                          }}
                        >
                          <MonoEffectList>{e.text}</MonoEffectList>
                        </div>
                      );
                    })}

                    <Spacers height="16px" />

                    <div>
                      <div>Amount</div>

                      {/* <FullSlider
                        color="hsl(180,100%,35%)"
                        min="2"
                        max="10"
                        format="rgb"
                        value={amount}
                        onChange={(e) => setAmount(e.target.valueAsNumber)}
                      /> */}
                    </div>
                  </VerticalMenu>
                )}
              </div>
            );
          })}
        </VerticalMenu>

        {/*<Container textAlign="center">
          <CodeModal code={HarmonySample(color, type, effect, amount)} />
        </Container> */}
      </FlexColumn>

      {!isComputer && !isWideScreen && <Spacers width="20px" />}

      <FlexColumn $cols={8}>
        <FlexRow $gap="8px" $wrap="wrap">
          {harmony.map((swatch, i) => (
            <SwatchContainer key={swatch + "_" + i}>
              <Swatch
                title={swatch}
                $radius={65}
                $borderRadius="4px"
                background={swatch}
                onClick={() => setColor(CM(swatch))}
                $cursor="pointer"
              />
              {swatch !== "transparent" && <SwatchCounter>{i + 1}</SwatchCounter>}
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
