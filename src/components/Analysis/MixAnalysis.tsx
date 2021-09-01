import React, { useEffect, useRef, useState } from "react";
import { Divider, Grid, Header, Label, Table } from "semantic-ui-react";
import ColorSelectorWidget from "../ColorSelectorWidget";
import useDebounce from "../../hooks/useDebounce";
import CodeModal from "./CodeModal";
import { Swatch } from "../../styles/Swatch";
import RangeSlider from "../Sliders/RangeSlider";
import { MixSample } from "../../utils/codeSamples";
import tinycolor from "tinycolor2";
import { colord, extend } from "colord";
import { default as colordMixPlugin } from "colord/plugins/mix";
import CM, { extendPlugins } from "colormaster";
import MixPlugin from "colormaster/plugins/mix";

extendPlugins([MixPlugin]); // colormaster
extend([colordMixPlugin]); // colord

export default function MixAnalysis(): JSX.Element {
  const [color1, setColor1] = useState(CM("hsla(0, 0%, 100%, 1)"));
  const [color2, setColor2] = useState(CM("hsla(0, 0%, 0%, 1)"));
  const [ratio, setRatio] = useState(0.5);
  const [mix, setMix] = useState(color1.mix(color2, ratio).stringHSL());
  const otherMix = useRef({ colord: mix, tiny: mix });

  const color1Debounce = useDebounce(color1, 100);
  const color2Debounce = useDebounce(color2, 100);
  const ratioDebounce = useDebounce(ratio, 100);

  useEffect(() => {
    setMix(color1.mix(color2, ratio).stringHSL());

    const rgb = [color1, color2].map((c) => c.stringRGB({ precision: [5, 5, 5, 5] }));
    const colordMix = colord(rgb[0]).mix(rgb[1], ratio);
    const tinyMix = tinycolor.mix(rgb[0], rgb[1], ratio * 100);
    otherMix.current = { colord: colordMix.toHslString(), tiny: tinyMix.toHslString() };
  }, [color1, color2, ratio]);

  return (
    <Grid columns={3} verticalAlign="middle" stackable centered>
      <Grid.Row>
        <Grid.Column width={6}>
          <ColorSelectorWidget color={color1} setColor={setColor1}>
            <Label size="big" color="black" attached="top left">
              Primary
            </Label>
          </ColorSelectorWidget>
        </Grid.Column>

        <Grid.Column width={4} textAlign="center">
          <Grid verticalAlign="middle" textAlign="center">
            <Label size="huge" color="teal" pointing="below">
              Ratio
            </Label>
            <RangeSlider
              color="hsl(180,100%,35%)"
              min="0"
              max="100"
              value={ratio * 100}
              postfix="%"
              onChange={(e) => setRatio(e.target.valueAsNumber / 100)}
            />
          </Grid>

          <Divider hidden />

          <Table celled textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Header as="h3" color="blue">
                    ColorMaster
                  </Header>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Header as="h3">colord</Header>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Header as="h3">TinyColor2</Header>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                {[mix, otherMix.current.colord, otherMix.current.tiny].map((val, i) => {
                  const lib = i === 0 ? "CM" : i === 1 ? "colord" : "TinyColor";
                  return (
                    <Table.Cell key={val + "-" + lib}>
                      <Swatch
                        title={val}
                        radius={50}
                        borderRadius="4px"
                        display="inline-block"
                        position="relative"
                        background={val}
                      />
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            </Table.Body>
          </Table>

          <CodeModal code={MixSample(color1Debounce, color2Debounce, ratioDebounce, otherMix.current)} />
        </Grid.Column>

        <Grid.Column width={6}>
          <ColorSelectorWidget color={color2} setColor={setColor2}>
            <Label size="big" color="black" attached="top right">
              Secondary
            </Label>
          </ColorSelectorWidget>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
