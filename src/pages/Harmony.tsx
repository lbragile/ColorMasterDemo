import React, { useEffect, useState } from "react";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import HarmonyPlugin from "colormaster/plugins/harmony";
import { THarmony, TMonoEffect } from "colormaster/types";
import { useHistory } from "react-router-dom";
import { Menu, Grid, Label, Icon, Container } from "semantic-ui-react";
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

const StyledMenu = styled(Menu)`
  && {
    margin: 0 auto;
    margin-bottom: 24px;
  }
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
    <Grid verticalAlign="middle" stackable>
      <Grid.Row>
        <Grid.Column width={5}>
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
        </Grid.Column>

        <Grid.Column width={3} textAlign="left">
          <StyledMenu vertical>
            {typeOptions.map((t) => {
              return (
                <Menu.Item
                  key={t.text + "-menu-item"}
                  link
                  active={type === t.value}
                  onClick={() => setType(t.value as THarmony)}
                >
                  {t.text}{" "}
                  {t.text === "monochromatic" && type !== t.value && (
                    <Label color="teal">
                      <Icon name="chevron circle down" />
                      {effectOptions.length}
                    </Label>
                  )}
                  {type === "monochromatic" && t.text === "monochromatic" && (
                    <Menu.Menu>
                      {effectOptions.map((e) => {
                        return (
                          <Menu.Item
                            as="span"
                            key={e.text + "-monochromatic-effect"}
                            active={e.text === effect}
                            onClick={() => {
                              setEffect(e.text as TMonoEffect);
                              setType("monochromatic");
                            }}
                          >
                            <MonoEffectList>{e.text}</MonoEffectList>
                          </Menu.Item>
                        );
                      })}

                      <Spacers height="16px" />

                      <Menu.Item>
                        <Label attached="top left" color="teal">
                          Amount
                        </Label>

                        <FullSlider
                          color="hsl(180,100%,35%)"
                          min="2"
                          max="10"
                          format="hex"
                          value={amount}
                          onChange={(e) => setAmount(e.target.valueAsNumber)}
                        />
                      </Menu.Item>
                    </Menu.Menu>
                  )}
                </Menu.Item>
              );
            })}
          </StyledMenu>

          <Container textAlign="center">
            <CodeModal code={HarmonySample(color, type, effect, amount)} />
          </Container>
        </Grid.Column>

        {!isComputer && !isWideScreen && <Spacers width="20px" />}

        <Grid.Column width={type === "monochromatic" ? 6 : 7} textAlign="center">
          <Grid.Row>
            {[...harmony, ...new Array(11 - harmony.length).fill("transparent")].map((swatch, i) => (
              <Swatch
                key={swatch + "_" + i}
                title={swatch === "transparent" ? undefined : swatch}
                $radius={65}
                $borderRadius="4px"
                $borderColor={swatch === "transparent" ? swatch : undefined}
                display="inline-block"
                position="relative"
                background={swatch}
                onClick={() => swatch !== "transparent" && setColor(CM(swatch))}
                $cursor={swatch !== "transparent" ? "pointer" : ""}
              >
                {swatch !== "transparent" && <SwatchCounter>{i + 1}</SwatchCounter>}
                {CM(swatch).stringHSL({ precision: [2, 2, 2, 2] }) === color.stringHSL({ precision: [2, 2, 2, 2] }) && (
                  <CurrentColorIcon name="check circle" inverted={color.isDark()} size="large" />
                )}
              </Swatch>
            ))}
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
