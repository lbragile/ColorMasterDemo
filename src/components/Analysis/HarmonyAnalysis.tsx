import React, { useEffect, useState } from "react";
import { Divider, Grid, Icon, Label, Menu } from "semantic-ui-react";
import ColorSelectorWidget from "../ColorSelectorWidget";
import useDebounce from "../../hooks/useDebounce";
import { Swatch } from "../../styles/Swatch";
import RangeSlider from "../Sliders/RangeSlider";
import { HarmonySample } from "../../utils/codeSamples";
import CM, { extendPlugins } from "colormaster";
import HarmonyPlugin from "colormaster/plugins/harmony";
import { THarmony, TMonoEffect } from "colormaster/types";
import styled from "styled-components";
import CodeModal from "./CodeModal";
import A11yPlugin from "colormaster/plugins/accessibility";
import { useHistory } from "react-router";

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

const CurrentColorIcon = styled(Icon)`
  && {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const SwatchCounter = styled(Label)`
  && {
    border-radius: 2px 0;
    color: black;
    position: absolute;
    left: 0;
  }
`;

export default function HarmonyAnalysis(): JSX.Element {
  const [color, setColor] = useState(CM("hsla(0, 100%, 50%, 1)"));
  const [harmony, setHarmony] = useState(color.harmony().map((c) => c.stringHSL({ precision: [2, 2, 2, 2] })));
  const [type, setType] = useState<THarmony>("analogous");
  const [effect, setEffect] = useState<TMonoEffect>("shades");
  const [amount, setAmount] = useState(7);

  const colorDebounce = useDebounce(color, 100);
  const history = useHistory();

  useEffect(() => {
    setHarmony(
      colorDebounce
        .harmony({ type, effect, amount })
        .map((c) => c.stringHSL({ precision: [2, 2, 2, 2] }))
        .filter((val, i, arr) => arr.indexOf(val) === i) // filter duplicates in case of picker overlap
    );
  }, [colorDebounce, type, effect, amount]);

  useEffect(() => {
    const baseSearch = `?color=${colorDebounce.stringHEX().toLowerCase()}&type=${type}`;

    history.replace({
      pathname: "/harmony",
      search: type !== "monochromatic" ? baseSearch : `${baseSearch}&effect=${effect}&amount=${amount}`
    });
  }, [history, colorDebounce, type, effect, amount]);

  return (
    <Grid columns={3} verticalAlign="middle" stackable centered>
      <Grid.Row>
        <Grid.Column width={5}>
          <ColorSelectorWidget
            color={color}
            setColor={setColor}
            initPicker={3}
            harmony={
              // only show harmonies if not shades or tints
              type !== "monochromatic" || (type === "monochromatic" && effect === "tones")
                ? color.harmony({ type, effect, amount })
                : undefined
            }
          />
        </Grid.Column>

        <Grid.Column width={3} textAlign="left">
          <Menu vertical>
            {typeOptions.map((t) => {
              return (
                <Menu.Item
                  key={t.text + "-menu-item"}
                  link
                  active={type === t.value}
                  onClick={() => setType(t.value as THarmony)}
                >
                  {t.text}{" "}
                  {t.text === "monochromatic" && (
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
                            {e.text}
                          </Menu.Item>
                        );
                      })}

                      <Divider hidden />
                      <Menu.Item>
                        <Label attached="top left" color="teal">
                          Amount
                        </Label>

                        <RangeSlider
                          color="hsl(180,100%,35%)"
                          min="2"
                          max="10"
                          format="hex"
                          showNum={false}
                          value={amount}
                          onChange={(e) => setAmount(e.target.valueAsNumber)}
                        />
                      </Menu.Item>
                    </Menu.Menu>
                  )}
                </Menu.Item>
              );
            })}
          </Menu>

          <Divider hidden />
        </Grid.Column>

        <Grid.Column columns="equal" textAlign="center">
          <Grid.Row>
            {harmony.map((swatch, i) => (
              <Swatch
                key={swatch}
                title={swatch}
                radius={65}
                borderRadius="4px"
                display="inline-block"
                position="relative"
                background={swatch}
                onClick={() => setColor(CM(swatch))}
              >
                {type === "monochromatic" && <SwatchCounter>{i + 1}</SwatchCounter>}
                {CM(swatch).stringHSL({ precision: [2, 2, 2, 2] }) === color.stringHSL({ precision: [2, 2, 2, 2] }) && (
                  <CurrentColorIcon name="check circle" inverted={color.isDark()} size="large" />
                )}
              </Swatch>
            ))}
          </Grid.Row>

          <Divider hidden />
          <CodeModal code={HarmonySample(color, type, effect, amount)} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
