import React, { useEffect, useState } from "react";
import { Divider, Dropdown, Grid, Header, Icon, Label, Popup } from "semantic-ui-react";
import ColorSelectorWidget from "../ColorSelectorWidget";
import useDebounce from "../../hooks/useDebounce";
import CodeModal from "./CodeModal";
import { Swatch } from "../../styles/Swatch";
import RangeSlider from "../Sliders/RangeSlider";
import { MixSample } from "../../utils/codeSamples";
import CM, { extendPlugins } from "colormaster";
import MixPlugin from "colormaster/plugins/mix";
import { TFormat } from "colormaster/types";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";
import ColorIndicator from "../ColorIndicator";
import Spacers from "../Spacers";

extendPlugins([MixPlugin]);

type TFormatDropdown = Exclude<TFormat, "invalid" | "name">;

const colorspaceOpts = ["rgb", "hex", "hsl", "hsv", "hwb", "lab", "lch", "luv", "uvw", "ryb", "cmyk", "xyz"].map(
  (value, i) => ({ key: i, text: value.toUpperCase(), value })
);

export default function MixAnalysis(): JSX.Element {
  const history = useHistory();
  const query = useQuery();

  const [primary, setPrimary] = useState(CM(query.primary ? "#" + query.primary : "hsla(180, 100%, 50%, 1)"));
  const [secondary, setSecondary] = useState(CM(query.secondary ? "#" + query.secondary : "hsla(0, 100%, 50%, 1)"));
  const [ratio, setRatio] = useState(query.ratio ? +query.ratio : 0.5);
  const [colorspace, setColorspace] = useState<TFormatDropdown>(
    (colorspaceOpts.find((item) => item.value === query.colorspace)?.value as TFormatDropdown) ?? "luv"
  );
  const [alpha, setAlpha] = useState(true);
  const [mix, setMix] = useState(primary.mix({ color: secondary, ratio, colorspace }).stringHSL({ alpha }));

  const primaryDebounce = useDebounce(primary, 100);
  const secondaryDebounce = useDebounce(secondary, 100);
  const ratioDebounce = useDebounce(ratio, 100);

  useEffect(() => {
    setMix(primary.mix({ color: secondary, ratio, colorspace }).stringHSL({ alpha }));
  }, [primary, secondary, ratio, colorspace, alpha]);

  useEffect(() => {
    history.replace({
      pathname: "/mix",
      search: `?primary=${primaryDebounce.stringHEX().slice(1).toLowerCase()}&secondary=${secondaryDebounce
        .stringHEX()
        .slice(1)
        .toLowerCase()}&ratio=${ratioDebounce}&colorspace=${colorspace}`
    });
  }, [history, primaryDebounce, secondaryDebounce, ratioDebounce, colorspace]);

  return (
    <Grid columns={3} verticalAlign="middle" stackable centered>
      <Grid.Column width={5}>
        <ColorSelectorWidget color={primary} setColor={setPrimary} initPicker="sketch">
          <Label size="big" color="black" attached="top left">
            Primary
          </Label>
        </ColorSelectorWidget>
      </Grid.Column>

      <Grid.Column width={6} textAlign="center">
        <Grid.Row width={6}>
          <Label size="huge" color="teal" horizontal>
            Ratio
          </Label>
        </Grid.Row>

        <Spacers height="12px" />

        <Grid verticalAlign="middle">
          <RangeSlider
            color={secondary.stringHSL()}
            colorRight={primary.stringHSL()}
            min="0"
            max="100"
            value={ratio * 100}
            postfix="%"
            onChange={(e) => setRatio(e.target.valueAsNumber / 100)}
          />
        </Grid>

        <Spacers height="20px" />

        <Divider horizontal>
          <Header as="h2">
            <Icon name="arrow circle down" color="teal" size="massive" />
          </Header>
        </Divider>

        <Spacers height="20px" />

        <Grid verticalAlign="middle" textAlign="center">
          <Grid.Column computer={8} mobile={14}>
            <ColorIndicator color={mix} alpha={alpha} setAlpha={setAlpha} />
          </Grid.Column>
        </Grid>

        <Divider hidden />

        <Grid.Row>
          <Swatch
            title={mix}
            radius={75}
            borderRadius="4px"
            display="inline-block"
            position="relative"
            background={mix}
            tabIndex={0}
          />
        </Grid.Row>

        <Divider hidden />

        <Grid.Row textAlign="left">
          <Header>
            <Label color="teal" size="big">
              Color Space
            </Label>
          </Header>
        </Grid.Row>

        <Spacers height="10px" />

        <Grid.Row>
          <Dropdown
            compact
            search
            selection
            options={colorspaceOpts}
            value={colorspace}
            onChange={(e, { value }) => setColorspace(value as TFormatDropdown)}
          />

          <Spacers width="4px" />

          <Popup
            content="The two colors will be converted to this color space when mixing"
            position="right center"
            trigger={<Icon name="info circle" color="teal" size="large" />}
          />
        </Grid.Row>

        <Divider hidden />

        <CodeModal code={MixSample(primaryDebounce, secondaryDebounce, ratioDebounce, colorspace, alpha)} />
      </Grid.Column>

      <Grid.Column width={5}>
        <ColorSelectorWidget color={secondary} setColor={setSecondary} initPicker="sketch">
          <Label size="big" color="black" attached="top right">
            Secondary
          </Label>
        </ColorSelectorWidget>
      </Grid.Column>
    </Grid>
  );
}
