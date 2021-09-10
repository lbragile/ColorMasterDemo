import React, { useEffect, useState } from "react";
import { Container, Dropdown, Grid, Header } from "semantic-ui-react";
import ColorSelectorWidget from "../ColorSelectorWidget";
import useDebounce from "../../hooks/useDebounce";
import { Swatch } from "../../styles/Swatch";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";
import useSliderChange from "../../hooks/useSliderChange";
import ColorIndicator from "../ColorIndicator";
import Spacers from "../Spacers";
import { ManipulationSample } from "../../utils/codeSamples";
import CodeModal from "./CodeModal";
import addColor from "../../utils/addColor";
import CM from "colormaster";

const ColorAdjustmentOpts = [
  {
    key: "inc",
    text: "Increment",
    value: "inc"
  },
  {
    key: "dec",
    text: "Decrement",
    value: "dec"
  }
];

export default function ManipulationAnalysis(): JSX.Element {
  const history = useHistory();
  const query = useQuery();

  const [alpha, setAlpha] = useState(true);
  const [color, setColor] = useState(CM(query.color ?? "hsla(180, 50%, 50%, 0.5)"));
  const [incrementColor, setIncrementColor] = useState(
    CM(`hsla(${query.hueBy ?? 0.01}, ${query.satBy ?? 0.01}%, ${query.lightBy ?? 0.01}%, ${query.alphaBy ?? 1e-4})`)
  );
  const [isIncrement, setIsIncrement] = useState(true);
  const [invert, setInvert] = useState(CM(color.hsla()).invert({ alpha }));
  const [grayscale, setGrayscale] = useState(CM(color.rgba()).grayscale());
  const [rotate, setRotate] = useState(CM(color.hsla()).rotate((isIncrement ? 1 : -1) * incrementColor.hue));

  const [swatchColor, setSwatchColor] = useState(addColor(color, incrementColor, isIncrement));

  const colorDebounce = useDebounce(color, 100);
  const incrementColorDebounce = useDebounce(incrementColor, 100);
  const currentSliders = useSliderChange(incrementColor, setIncrementColor, "hsl", alpha, "0.01");

  useEffect(() => {
    setColor(colorDebounce);
    setInvert(CM(colorDebounce.hsla()).invert({ alpha }));
    setGrayscale(CM(colorDebounce.rgba()).grayscale());
    setRotate(CM(colorDebounce.hsla()).rotate((isIncrement ? 1 : -1) * incrementColor.hue));
  }, [colorDebounce, incrementColor, alpha, isIncrement]);

  useEffect(() => {
    setSwatchColor(addColor(color, incrementColor, isIncrement));
  }, [color, incrementColor, isIncrement]);

  useEffect(() => {
    const { h, s, l, a } = incrementColorDebounce.hsla();
    const color = colorDebounce.stringHEX().slice(1).toLowerCase();
    history.replace({
      pathname: "/manipulation",
      search: `?color=${color}&hueBy=${h.toFixed(2)}&satBy=${s.toFixed(2)}&lightBy=${l.toFixed(2)}&alphaBy=${a.toFixed(
        4
      )}`
    });
  }, [history, colorDebounce, incrementColorDebounce]);

  return (
    <Grid verticalAlign="middle" stackable>
      <Grid.Column width={5}>
        <ColorSelectorWidget
          color={color}
          setColor={setColor}
          initPicker="wheel"
          initColorspace="hsl"
          harmony={[color, swatchColor, rotate, grayscale, invert]}
        />
      </Grid.Column>

      <Spacers height="37px" />

      <Grid.Column width={5}>
        <Header textAlign="center">
          <Dropdown
            value={isIncrement ? "inc" : "dec"}
            compact
            selection
            options={ColorAdjustmentOpts}
            onChange={() => setIsIncrement(!isIncrement)}
          />
          <Spacers width="4px" />
          By
        </Header>

        {currentSliders.sliders}

        <Spacers height="32px" />

        <Container textAlign="center">
          <CodeModal code={ManipulationSample(colorDebounce, incrementColorDebounce, isIncrement, alpha)} />
        </Container>
      </Grid.Column>

      <Grid.Column width={4}>
        <Grid verticalAlign="middle" textAlign="center">
          <ColorIndicator
            color={swatchColor.stringHSL({ precision: [2, 2, 2, 2], alpha })}
            alpha={alpha}
            setAlpha={setAlpha}
          />
        </Grid>

        <Spacers height="20px" />

        <Grid columns="equal" textAlign="center" stackable>
          <Grid.Row>
            <Grid.Column>
              <Header>Adjust</Header>
              <Swatch
                title={swatchColor.stringHSL({ precision: [2, 2, 2, 2] })}
                $radius={75}
                $borderRadius="4px"
                background={swatchColor.stringHSL()}
                onClick={() => setColor(swatchColor)}
                $clickable
              />
            </Grid.Column>

            <Grid.Column>
              <Header>Grayscale</Header>
              <Swatch
                title={grayscale.stringRGB({ precision: [2, 2, 2, 2] })}
                $radius={75}
                $borderRadius="4px"
                background={grayscale.stringHSL()}
                onClick={() => setColor(grayscale)}
                $clickable
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header>Rotate</Header>
              <Swatch
                title={rotate.stringHSL({ precision: [2, 2, 2, 2] })}
                $radius={75}
                $borderRadius="4px"
                background={rotate.stringHSL()}
                onClick={() => setColor(rotate)}
                $clickable
              />
            </Grid.Column>

            <Grid.Column>
              <Header>Invert</Header>
              <Swatch
                title={invert.stringHSL({ precision: [2, 2, 2, 2] })}
                $radius={75}
                $borderRadius="4px"
                background={invert.stringHSL()}
                onClick={() => setColor(invert)}
                $clickable
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid>
  );
}
