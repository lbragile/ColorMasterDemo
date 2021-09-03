import React, { useEffect, useState } from "react";
import { Divider, Dropdown, Grid, Header, Icon, Label, Message, Popup } from "semantic-ui-react";
import ColorSelectorWidget from "../ColorSelectorWidget";
import useDebounce from "../../hooks/useDebounce";
import CodeModal from "./CodeModal";
import { Swatch } from "../../styles/Swatch";
import RangeSlider from "../Sliders/RangeSlider";
import { MixSample } from "../../utils/codeSamples";
import CM, { extendPlugins } from "colormaster";
import MixPlugin from "colormaster/plugins/mix";
import { TFormat } from "colormaster/types";
import useCopyToClipboard from "../../hooks/useCopytoClipboard";
import styled from "styled-components";

extendPlugins([MixPlugin]);

const colorspaceOpts = ["rgb", "hex", "hsl", "hsv", "hwb", "lab", "lch", "luv", "uvw", "ryb", "cmyk", "xyz"].map(
  (value, i) => ({ key: i, text: value.toUpperCase(), value })
);

const StyledDropdown = styled(Dropdown)`
  && {
    margin: 0 6px;
  }
`;

export default function MixAnalysis(): JSX.Element {
  const [color1, setColor1] = useState(CM("hsla(30, 100%, 50%, 1)"));
  const [color2, setColor2] = useState(CM("hsla(0, 0%, 50%, 1)"));
  const [ratio, setRatio] = useState(0.5);
  const [colorspace, setColorspace] = useState<Exclude<TFormat, "invalid" | "name">>("luv");
  const [mix, setMix] = useState(color1.mix({ color: color2, ratio, colorspace }).stringHSL());

  const color1Debounce = useDebounce(color1, 100);
  const color2Debounce = useDebounce(color2, 100);
  const ratioDebounce = useDebounce(ratio, 100);

  const [copy, setCopy] = useCopyToClipboard();

  useEffect(() => {
    setMix(color1.mix({ color: color2, ratio, colorspace }).stringHSL());
  }, [color1, color2, ratio, colorspace]);

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
          <Label size="huge" color="teal" horizontal>
            Ratio
          </Label>
          <Divider hidden />
          <Grid verticalAlign="middle" textAlign="center">
            <RangeSlider
              color={color2.stringHSL()}
              colorRight={color1.stringHSL()}
              min="0"
              max="100"
              value={ratio * 100}
              postfix="%"
              onChange={(e) => setRatio(e.target.valueAsNumber / 100)}
            />
          </Grid>

          <Divider hidden />

          <Divider horizontal>
            <Header as="h2">
              <Icon name="arrow circle down" color="teal" size="massive" />
            </Header>
          </Divider>

          <Divider hidden />

          <Grid.Row>
            <Swatch
              title={mix}
              radius={75}
              borderRadius="4px"
              display="inline-block"
              position="relative"
              background={mix}
              $clickable
              tabIndex={0}
              onClick={() => setCopy(mix)}
              onBlur={() => setCopy("")}
            />
          </Grid.Row>

          <Grid.Row>
            {copy && (
              <Message compact positive>
                <b>Copied to clipboard!</b>
              </Message>
            )}
          </Grid.Row>

          <Divider hidden />

          <Grid.Row textAlign="left">
            <Header>
              <Label color="teal" size="big">
                Color Space
              </Label>
            </Header>

            <StyledDropdown
              compact
              search
              selection
              options={colorspaceOpts}
              value={colorspace}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>,
                { value }: { value: Exclude<TFormat, "invalid" | "name"> }
              ) => setColorspace(value)}
            />

            <Popup
              content="The two colors will be converted to this color space when mixing"
              position="right center"
              trigger={<Icon name="info circle" color="teal" size="large" />}
            />
          </Grid.Row>

          <Divider hidden />

          <CodeModal code={MixSample(color1Debounce, color2Debounce, ratioDebounce, colorspace)} />
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
