import React, { useEffect, useState } from "react";
import { Container, Divider, Dropdown, Grid, Header, Icon, Label, List, Message } from "semantic-ui-react";
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

const INFORMATIVE_TEXT = [
  { header: "Color Picker", text: "Where you select color from the different pickers/sliders." },
  {
    header: "Adjust",
    text: "Color picker & each of the above sliders! Combines both according to dropdown selection."
  },
  {
    header: "Rotate",
    text: "Color picker & hue slider from above sliders only! Rotation is simply moving at a fixed radius (arc) along the color wheel."
  },
  {
    header: "Invert",
    text: "Color picker only! Similar to complementary harmony. Rotates 180° and flips the lightness value. Alpha channel included based on selection."
  },
  {
    header: "Grayscale",
    text: "Color picker only! Output will vary slightly in most cases. Large variance if lightness is changed. Centered on 2D color wheel for all lightness values."
  }
];

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

  const [alphaAdjust, setAlphaAdjust] = useState(true);
  const [alphaRotate, setAlphaRotate] = useState(true);
  const [alphaInvert, setAlphaInvert] = useState(true);
  const [alphaGrayscale, setAlphaGrayscale] = useState(true);

  const [color, setColor] = useState(CM(query.color ?? "hsla(180, 50%, 50%, 0.5)"));
  const [incrementColor, setIncrementColor] = useState(
    CM(`hsla(${query.hueBy ?? 72}, ${query.satBy ?? 15}%, ${query.lightBy ?? 10}%, ${query.alphaBy ?? 0.05})`)
  );
  const [isIncrement, setIsIncrement] = useState(true);
  const [invert, setInvert] = useState(CM(color.hsla()).invert({ alpha: alphaInvert }));
  const [grayscale, setGrayscale] = useState(CM(color.rgba()).grayscale());
  const [rotate, setRotate] = useState(CM(color.hsla()).rotate((isIncrement ? 1 : -1) * incrementColor.hue));

  const [adjust, setAdjust] = useState(addColor(color, incrementColor, isIncrement));

  const colorDebounce = useDebounce(color, 100);
  const incrementColorDebounce = useDebounce(incrementColor, 100);
  const currentSliders = useSliderChange({
    color: incrementColor,
    setColor: setIncrementColor,
    colorspace: "hsl",
    min: "0.01"
  });

  useEffect(() => {
    setColor(color);
    setInvert(CM(color.hsla()).invert({ alpha: alphaInvert }));
    setGrayscale(CM(color.rgba()).grayscale());
    setRotate(CM(color.hsla()).rotate((isIncrement ? 1 : -1) * incrementColor.hue));
  }, [color, incrementColor, alphaInvert, isIncrement]);

  useEffect(() => {
    setAdjust(addColor(color, incrementColor, isIncrement));
  }, [color, incrementColor, isIncrement]);

  useEffect(() => {
    const { h, s, l, a } = incrementColorDebounce.hsla();
    const color = colorDebounce.stringHEX().slice(1).toLowerCase();
    history.replace({
      pathname: "/manipulation",
      search: `?color=${color}&hueBy=${h.toFixed(2)}&satBy=${s.toFixed(2)}&lightBy=${l.toFixed(2)}&alphaBy=${a.toFixed(
        4
      )}&isIncrement=${isIncrement}&alpha=[${[alphaAdjust, alphaRotate, alphaInvert, alphaGrayscale].join(",")}]`
    });
  }, [
    history,
    colorDebounce,
    incrementColorDebounce,
    isIncrement,
    alphaAdjust,
    alphaRotate,
    alphaInvert,
    alphaGrayscale
  ]);

  return (
    <Grid verticalAlign="middle" stackable centered>
      <Grid.Column width={5}>
        <ColorSelectorWidget
          color={color}
          setColor={setColor}
          initPicker="wheel"
          initColorspace="hsl"
          harmony={[color, adjust, rotate, invert, grayscale]}
        />
      </Grid.Column>

      <Spacers width="8px" />

      <Grid.Column width={4}>
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

        <Spacers height="12px" />

        <Grid.Column width={10}>{currentSliders.sliders}</Grid.Column>

        <Spacers height="20px" />

        <Message color="blue">
          <Message.Header>
            <Icon name="info circle" size="large" /> Information You Might Find Useful
          </Message.Header>

          <Spacers height="20px" />

          <Message.Content>
            <List verticalAlign="middle">
              {INFORMATIVE_TEXT.map((item, i) => (
                <List.Item key={item.header}>
                  <List.Header>
                    <Label color="blue" horizontal>
                      {i + 1}
                    </Label>
                    {item.header}
                  </List.Header>
                  <Spacers height="1px" />
                  <List.Content>
                    {item.text}
                    <Spacers height="4px" />
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Message.Content>
        </Message>
      </Grid.Column>

      <Spacers width="8px" />

      <Grid.Column width={6}>
        <Grid columns="equal" verticalAlign="middle" textAlign="center">
          <Grid.Row>
            <Grid.Column width={8}>
              <Header>Adjust</Header>

              <ColorIndicator
                color={adjust.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaAdjust })}
                alpha={alphaAdjust}
                setAlpha={setAlphaAdjust}
              />

              <Spacers height="8px" />

              <Swatch
                title={adjust.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaAdjust })}
                $radius={75}
                $borderRadius="4px"
                background={adjust.stringHSL()}
                onClick={() => setColor(adjust)}
                $clickable
              />
            </Grid.Column>

            <Grid.Column width={8}>
              <Header>Rotate</Header>

              <ColorIndicator
                color={rotate.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaRotate })}
                alpha={alphaRotate}
                setAlpha={setAlphaRotate}
              />

              <Spacers height="8px" />

              <Swatch
                title={rotate.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaRotate })}
                $radius={75}
                $borderRadius="4px"
                background={rotate.stringHSL()}
                onClick={() => setColor(rotate)}
                $clickable
              />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={8}>
              <Header>Invert</Header>

              <ColorIndicator
                color={invert.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaInvert })}
                alpha={alphaInvert}
                setAlpha={setAlphaInvert}
              />

              <Spacers height="8px" />

              <Swatch
                title={invert.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaInvert })}
                $radius={75}
                $borderRadius="4px"
                background={invert.stringHSL()}
                onClick={() => setColor(invert)}
                $clickable
              />
            </Grid.Column>

            <Grid.Column width={8}>
              <Header>Grayscale</Header>

              <ColorIndicator
                color={grayscale.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaGrayscale })}
                alpha={alphaGrayscale}
                setAlpha={setAlphaGrayscale}
              />

              <Spacers height="8px" />

              <Swatch
                title={grayscale.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaGrayscale })}
                $radius={75}
                $borderRadius="4px"
                background={grayscale.stringHSL()}
                onClick={() => setColor(grayscale)}
                $clickable
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Spacers height="32px" />

        <Container textAlign="center">
          <CodeModal
            code={ManipulationSample(colorDebounce, incrementColorDebounce, isIncrement, {
              adjust: alphaAdjust,
              rotate: alphaRotate,
              invert: alphaInvert,
              grayscale: alphaGrayscale
            })}
          />
        </Container>
      </Grid.Column>
    </Grid>
  );
}
